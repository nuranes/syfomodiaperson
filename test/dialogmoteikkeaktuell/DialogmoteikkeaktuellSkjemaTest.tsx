import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { dialogmoteIkkeAktuellRoutePath } from "@/routers/AppRouter";
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
import DialogmoteikkeaktuellSkjema, {
  dialogmoteikkeaktuellSkjemaBeskrivelseMaxLength,
  texts as ikkeaktuellSkjemaTexts,
  IkkeAktuellArsakText,
  ikkeaktuellArsakTexts,
} from "../../src/components/dialogmoteikkeaktuell/DialogmoteikkeaktuellSkjema";
import { stubAktivVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import { CreateIkkeAktuellDTO } from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { renderWithRouter } from "../testRouterUtils";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

let queryClient: QueryClient;

describe("DialogmoteikkeaktuellSkjema", () => {
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

  const submitButtonText = "Sett ikke aktuell";

  it("viser informasjonstekster", () => {
    renderDialogmoteikkeaktuellSkjema();

    expect(screen.getByText(ikkeaktuellSkjemaTexts.noBrev)).to.not.be.empty;
    expect(screen.getByText(ikkeaktuellSkjemaTexts.infoKandidatlist)).to.not.be
      .empty;
  });

  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderDialogmoteikkeaktuellSkjema();
    await clickButton(submitButtonText);

    expect(await screen.findByText(ikkeaktuellSkjemaTexts.arsakErrorMessage)).to
      .not.be.empty;

    const tooLongBeskrivelse = getTooLongText(
      dialogmoteikkeaktuellSkjemaBeskrivelseMaxLength
    );
    const beskrivelseInput = getTextInput(
      ikkeaktuellSkjemaTexts.beskrivelseLabel
    );
    changeTextInput(beskrivelseInput, tooLongBeskrivelse);
    const maxLengthErrorMsg = "1 tegn for mye";
    expect(screen.getAllByText(maxLengthErrorMsg)).to.not.be.empty;

    passSkjemaInput(ikkeaktuellArsakTexts[0], "beskrivelse");

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryAllByText(ikkeaktuellSkjemaTexts.arsakErrorMessage)).to
        .be.empty;
    });
    await waitFor(() => {
      expect(screen.queryAllByText(maxLengthErrorMsg)).to.be.empty;
    });

    await clickButton(submitButtonText);
  });

  it("sett ikke aktuell med kun med obligatorisk verdier fra skjema", async () => {
    renderDialogmoteikkeaktuellSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(3);

    const ikkeaktuellArsakText = ikkeaktuellArsakTexts[0];
    passSkjemaInput(ikkeaktuellArsakText);

    await clickButton(submitButtonText);
    await waitFor(() => {
      const ikkeaktuellMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateIkkeAktuellDTO: CreateIkkeAktuellDTO = {
        personIdent: arbeidstaker.personident,
        arsak: ikkeaktuellArsakText.arsak,
        beskrivelse: "",
      };

      expect(ikkeaktuellMutation.state.variables).to.deep.equal(
        expectedCreateIkkeAktuellDTO
      );
    });
  });

  it("sett ikke aktuell med alle verdier fra skjema", async () => {
    renderDialogmoteikkeaktuellSkjema();

    expect(screen.getAllByRole("radio")).to.have.length(3);

    const beskrivelse = "Dette er en begrunnelse";
    const ikkeaktuellArsakText = ikkeaktuellArsakTexts[0];

    passSkjemaInput(ikkeaktuellArsakText, beskrivelse);

    await clickButton(submitButtonText);

    await waitFor(() => {
      const ikkeaktuellMutation = queryClient.getMutationCache().getAll()[0];
      const expectedCreateIkkeAktuellDTO: CreateIkkeAktuellDTO = {
        personIdent: arbeidstaker.personident,
        arsak: ikkeaktuellArsakText.arsak,
        beskrivelse,
      };

      expect(ikkeaktuellMutation.state.variables).to.deep.equal(
        expectedCreateIkkeAktuellDTO
      );
    });
  });
});

const renderDialogmoteikkeaktuellSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <DialogmoteikkeaktuellSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteIkkeAktuellRoutePath,
    [dialogmoteIkkeAktuellRoutePath]
  );
};

const passSkjemaInput = (
  ikkeaktuellArsakText: IkkeAktuellArsakText,
  beskrivelse?: string
) => {
  const arsakRadioButton = screen.getByText(ikkeaktuellArsakText.text);
  fireEvent.click(arsakRadioButton);

  if (beskrivelse) {
    const beskrivelseInput = getTextInput(
      ikkeaktuellSkjemaTexts.beskrivelseLabel
    );
    changeTextInput(beskrivelseInput, beskrivelse);
  }
};
