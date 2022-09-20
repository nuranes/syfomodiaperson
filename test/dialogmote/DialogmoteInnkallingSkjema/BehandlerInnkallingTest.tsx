import React from "react";
import { expect } from "chai";
import { QueryClientProvider } from "react-query";
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
  maxLengthErrorMessage,
} from "../../testUtils";
import { MAX_LENGTH_INNKALLING_FRITEKST } from "@/components/dialogmote/innkalling/DialogmoteInnkallingTekster";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import DialogmoteInnkallingSkjema from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";
import { stubInnkallingApi } from "../../stubs/stubIsdialogmote";
import { apiMock } from "../../stubs/stubApi";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import sinon from "sinon";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import { renderWithRouter } from "../../testRouterUtils";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";

let queryClient: any;
let apiMockScope;

describe("Dialogmoteinnkallingskjema", () => {
  let clock: any;
  const today = new Date(Date.now());

  beforeEach(() => {
    apiMockScope = apiMock();
    queryClient = queryClientWithMockData();
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => [behandler]
    );

    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer maks lengde på alle fritekstfelter inkl behandler", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_INNKALLING_FRITEKST);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_INNKALLING_FRITEKST
    );
    renderDialogmoteInnkallingSkjema();

    const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
    userEvent.click(fastlegeInput);

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
    clickButton("Send innkallingene");

    expect(screen.queryAllByText(maxLengthErrorMsg)).to.have.length(0);

    changeTextInput(fritekstArbeidstakerInput, tooLongFritekst);
    changeTextInput(fritekstArbeidsgiverInput, tooLongFritekst);
    changeTextInput(fritekstBehandlerInput, tooLongFritekst);
    clickButton("Send innkallingene");

    expect(
      screen.queryAllByRole("link", { name: maxLengthErrorMsg })
    ).to.have.length(3);
  });

  it("submit creates innkalling with behandler when behandler is selected", () => {
    stubInnkallingApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    clickButton("Send innkallingene");

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

    expect(innkallingMutation.options.variables).to.deep.equal(
      expectedInnkallingDto
    );
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
        <DialogmoteInnkallingSkjema />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    dialogmoteRoutePath,
    [dialogmoteRoutePath]
  );
};

const passSkjemaInput = () => {
  const virksomhetSelect = screen.getByRole("radio", {
    name: `Fant ikke virksomhetsnavn for ${arbeidsgiver.orgnr}`,
  });
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
  userEvent.click(fastlegeInput);
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
