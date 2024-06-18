import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  arbeidsgiver,
  arbeidstaker,
  behandler,
  mote,
  moteTekster,
  navEnhet,
} from "../testData";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../../testUtils";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import { renderWithRouter } from "../../testRouterUtils";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { MalformProvider } from "@/context/malform/MalformContext";
import {
  DialogmoteInnkallingSkjema,
  MAX_LENGTH_INNKALLING_FRITEKST,
} from "@/sider/dialogmoter/components/innkalling/DialogmoteInnkallingSkjema";

let queryClient: QueryClient;
let apiMockScope;

describe("Dialogmoteinnkallingskjema med behandler", () => {
  beforeEach(() => {
    apiMockScope = apiMock();
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => [behandler]
    );
  });

  it("validerer maks lengde på alle fritekstfelter inkl behandler", async () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_INNKALLING_FRITEKST);
    const maxLengthErrorMsg = "1 tegn for mye";
    renderDialogmoteInnkallingSkjema();

    const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
    await userEvent.click(fastlegeInput);

    const fritekstArbeidstakerInput = getTextInput(
      "Fritekst til arbeidstakeren (valgfri)"
    );
    const fritekstArbeidsgiverInput = getTextInput(
      "Fritekst til nærmeste leder (valgfri)"
    );
    const fritekstBehandlerInput = getTextInput(
      "Fritekst til behandler (valgfri)"
    );
    changeTextInput(
      fritekstArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      fritekstArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(fritekstBehandlerInput, moteTekster.fritekstTilBehandler);
    await clickButton("Send innkallingene");

    expect(screen.queryAllByText(maxLengthErrorMsg)).to.have.length(0);

    changeTextInput(fritekstArbeidstakerInput, tooLongFritekst);
    changeTextInput(fritekstArbeidsgiverInput, tooLongFritekst);
    changeTextInput(fritekstBehandlerInput, tooLongFritekst);
    await clickButton("Send innkallingene");

    expect(await screen.findAllByText(maxLengthErrorMsg)).to.have.length(3);
  });

  it("submit creates innkalling with behandler when behandler is selected", async () => {
    stubInnkallingApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
    renderDialogmoteInnkallingSkjema();
    await passSkjemaInput();

    await clickButton("Send innkallingene");

    await waitFor(() => {
      const innkallingMutation = queryClient.getMutationCache().getAll()[0];
      const expectedInnkallingDto = {
        arbeidsgiver: {
          virksomhetsnummer: arbeidsgiver.orgnr,
          fritekstInnkalling: moteTekster.fritekstTilArbeidsgiver,
          innkalling: expectedInnkallingDocuments.arbeidsgiver(true),
        },
        arbeidstaker: {
          personIdent: arbeidstaker.personident,
          fritekstInnkalling: moteTekster.fritekstTilArbeidstaker,
          innkalling: expectedInnkallingDocuments.arbeidstaker(true),
        },
        behandler: {
          personIdent: behandler.fnr,
          behandlerRef: behandler.behandlerRef,
          behandlerNavn: behandlerNavn(behandler),
          behandlerKontor: behandler.kontor,
          fritekstInnkalling: moteTekster.fritekstTilBehandler,
          innkalling: expectedInnkallingDocuments.behandler(),
        },
        tidSted: {
          sted: mote.sted,
          tid: mote.datoTid,
          videoLink: mote.videolink,
        },
      };

      expect(innkallingMutation.state.variables).to.deep.equal(
        expectedInnkallingDto
      );
    });
  });

  it("doesn't display behandler fritekst and preview when none is selected", () => {
    renderDialogmoteInnkallingSkjema();

    expect(
      screen.queryByRole("textbox", {
        name: /Fritekst til behandler/,
      })
    ).to.not.exist;
    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
  });
});

const renderDialogmoteInnkallingSkjema = () => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MalformProvider>
          <DialogmoteInnkallingSkjema />
        </MalformProvider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteRoutePath,
    [dialogmoteRoutePath]
  );
};

const passSkjemaInput = async () => {
  const virksomhetSelect = screen.getByRole("radio", {
    name: `Fant ikke virksomhetsnavn for ${arbeidsgiver.orgnr}`,
  });
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
  await userEvent.click(fastlegeInput);
  const fritekstArbeidstakerInput = getTextInput(
    "Fritekst til arbeidstakeren (valgfri)"
  );
  const fritekstArbeidsgiverInput = getTextInput(
    "Fritekst til nærmeste leder (valgfri)"
  );
  const fritekstBehandlerInput = getTextInput(
    "Fritekst til behandler (valgfri)"
  );
  fireEvent.click(virksomhetSelect);
  changeTextInput(datoInput, mote.dato);
  fireEvent.blur(datoInput);
  changeTextInput(klokkeslettInput, mote.klokkeslett);
  changeTextInput(stedInput, mote.sted);
  changeTextInput(videoLinkInput, mote.videolink);
  changeTextInput(
    fritekstArbeidstakerInput,
    moteTekster.fritekstTilArbeidstaker
  );
  changeTextInput(
    fritekstArbeidsgiverInput,
    moteTekster.fritekstTilArbeidsgiver
  );
  changeTextInput(fritekstBehandlerInput, moteTekster.fritekstTilBehandler);
};
