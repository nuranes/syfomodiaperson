import React from "react";
import { expect } from "chai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { dialogmoteUnntakRoutePath } from "@/routers/AppRouter";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { apiMock } from "../stubs/stubApi";
import { arbeidstaker, navEnhet } from "../dialogmote/testData";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { queryClientWithMockData } from "../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import DialogmoteunntakSkjema, {
  dialogmoteunntakSkjemaBeskrivelseMaxLength,
  texts as unntakSkjemaTexts,
  UnntakArsakText,
  unntakArsakTexts,
} from "../../src/components/dialogmoteunntak/DialogmoteunntakSkjema";
import { stubAktivVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import { CreateUnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { renderWithRouter } from "../testRouterUtils";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

let queryClient: QueryClient;

describe("DialogmoteunntakSkjema", () => {
  const apiMockScope = apiMock();

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
      () => dialogmotekandidatMock
    );
    queryClient.setQueryData(
      dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
      () => []
    );
    stubAktivVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
  });

  const submitButtonText = "Sett unntak";

  it("viser informasjonstekster", () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getByText(unntakSkjemaTexts.noBrev)).to.not.be.empty;
    expect(screen.getByText(unntakSkjemaTexts.infoKandidatlist)).to.not.be
      .empty;
  });

  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderDialogmoteunntakSkjema();
    clickButton(submitButtonText);

    expect(await screen.findByText(unntakSkjemaTexts.arsakErrorMessage)).to.not
      .be.empty;

    const tooLongBeskrivelse = getTooLongText(
      dialogmoteunntakSkjemaBeskrivelseMaxLength
    );
    const beskrivelseInput = getTextInput(unntakSkjemaTexts.beskrivelseLabel);
    changeTextInput(beskrivelseInput, tooLongBeskrivelse);
    const maxLengthErrorMsg = "1 tegn for mye";
    expect(screen.getAllByText(maxLengthErrorMsg)).to.not.be.empty;

    passSkjemaInput(unntakArsakTexts[0], "beskrivelse");

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryAllByText(unntakSkjemaTexts.arsakErrorMessage)).to.be
        .empty;
    });
    await waitFor(() => {
      expect(screen.queryAllByText(maxLengthErrorMsg)).to.be.empty;
    });

    clickButton(submitButtonText);
  });

  it("sett unntak med kun med obligatorisk verdier fra skjema", async () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(6);

    const unntakArsakText = unntakArsakTexts[0];
    passSkjemaInput(unntakArsakText);

    clickButton(submitButtonText);
    await waitFor(() => {
      const unntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateUnntakDTO: CreateUnntakDTO = {
        personIdent: arbeidstaker.personident,
        arsak: unntakArsakText.arsak,
        beskrivelse: "",
      };

      expect(unntakMutation.state.variables).to.deep.equal(
        expectedCreateUnntakDTO
      );
    });
  });

  it("sett unntak med alle verdier fra skjema", async () => {
    renderDialogmoteunntakSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(6);

    const beskrivelse = "Dette er en begrunnelse";
    const unntakArsakText = unntakArsakTexts[0];

    passSkjemaInput(unntakArsakText, beskrivelse);

    clickButton(submitButtonText);

    await waitFor(() => {
      const unntakMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateUnntakDTO: CreateUnntakDTO = {
        personIdent: arbeidstaker.personident,
        arsak: unntakArsakText.arsak,
        beskrivelse,
      };

      expect(unntakMutation.state.variables).to.deep.equal(
        expectedCreateUnntakDTO
      );
    });
  });
});

const renderDialogmoteunntakSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <DialogmoteunntakSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteUnntakRoutePath,
    [dialogmoteUnntakRoutePath]
  );
};

const passSkjemaInput = (
  unntakArsakText: UnntakArsakText,
  beskrivelse?: string
) => {
  const arsakRadioButton = screen.getByText(unntakArsakText.text);
  fireEvent.click(arsakRadioButton);

  if (beskrivelse) {
    const beskrivelseInput = getTextInput(unntakSkjemaTexts.beskrivelseLabel);
    changeTextInput(beskrivelseInput, beskrivelse);
  }
};
