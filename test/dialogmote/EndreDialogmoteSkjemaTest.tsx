import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { QueryClientProvider } from "react-query";
import React from "react";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import EndreDialogmoteSkjema from "@/components/dialogmote/endre/EndreDialogmoteSkjema";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../testUtils";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "@/components/SkjemaFeiloppsummering";
import { apiMock } from "../stubs/stubApi";
import { stubEndreApi } from "../stubs/stubIsdialogmote";
import { texts as endringSkjemaTexts } from "../../src/components/dialogmote/endre/EndreDialogmoteTekster";
import {
  dialogmote,
  dialogmoteMedBehandler,
  endretMote,
  moteTekster,
  navEnhet,
} from "./testData";
import {
  DialogmoteDTO,
  DocumentComponentType,
  EndreTidStedDialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MAX_LENGTH_ENDRE_BEGRUNNELSE } from "@/components/dialogmote/endre/EndreDialogmoteTekster";
import { expectedEndringDocuments } from "./testDataDocuments";
import sinon from "sinon";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { renderWithRouter } from "../testRouterUtils";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { stubAktivVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { queryClientWithMockData } from "../testQueryClient";

let queryClient: any;
let apiMockScope;

describe("EndreDialogmoteSkjemaTest", () => {
  let clock: any;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
    apiMockScope = apiMock();
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer begrunnelser og dato", () => {
    renderEndreDialogmoteSkjema(dialogmote);

    clickButton("Send");

    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(/Datoen må være etter/)).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
    expect(
      screen.getByRole("link", {
        name: /Datoen må være etter/,
      })
    ).to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);

    clickButton("Send");

    expect(screen.getAllByText(valideringsTexts.begrunnelseBehandlerMissing));
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseBehandlerMissing)).to
      .exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderEndreDialogmoteSkjema(dialogmote);

    clickButton("Send");

    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(/Datoen må være etter/)).to.not.be.empty;
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
    expect(
      screen.getByRole("link", {
        name: /Datoen må være etter/,
      })
    ).to.exist;

    // Angi dato og begrunnelser
    const datoInput = getTextInput("Dato");
    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(datoInput, endretMote.dato);
    fireEvent.blur(datoInput);

    // Feilmeldinger og feiloppsummering forsvinner
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidstakerMissing)
    ).to.be.empty;
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing)
    ).to.be.empty;
    expect(screen.queryAllByText(/Datoen må være etter/)).to.be.empty;

    // Fjern begrunnelser
    changeTextInput(begrunnelseArbeidstakerInput, "");
    changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises, feiloppsummering vises ved neste submit
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.exist;

    clickButton("Send");
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
  });
  it("validerer maks lengde på begrunnelser", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_ENDRE_BEGRUNNELSE);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_ENDRE_BEGRUNNELSE
    );
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(begrunnelseArbeidstakerInput, tooLongFritekst);
    changeTextInput(begrunnelseArbeidsgiverInput, tooLongFritekst);
    changeTextInput(begrunnelseBehandlerInput, tooLongFritekst);

    clickButton("Send");

    expect(
      screen.getAllByRole("link", { name: maxLengthErrorMsg })
    ).to.have.length(3, "Validerer maks lengde på alle begrunnelser");
  });

  it("endrer møte ved submit", () => {
    stubEndreApi(apiMockScope, dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    clickButton("Send");

    const endreMutation = queryClient.getMutationCache().getAll()[0];
    const expectedEndring = {
      arbeidsgiver: {
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
        endringsdokument: expectedEndringDocuments.arbeidsgiver(),
      },
      arbeidstaker: {
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
        endringsdokument: expectedEndringDocuments.arbeidstaker(),
      },
      videoLink: endretMote.videolink,
      sted: endretMote.sted,
      tid: endretMote.datoTid,
    };
    expect(endreMutation.options.variables).to.deep.equal(expectedEndring);
  });

  it("trimmer videolenke i endring som sendes til api", () => {
    stubEndreApi(apiMockScope, dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const link = "https://video.nav.no/abc";
    const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
    const linkWithWhitespace = `   ${link}  `;
    changeTextInput(videoLinkInput, linkWithWhitespace);

    clickButton("Send");

    const endreMutation = queryClient.getMutationCache().getAll()[0];
    const { videoLink, arbeidsgiver, arbeidstaker } = endreMutation.options
      .variables as EndreTidStedDialogmoteDTO;

    const linkDocumentComponents = [
      ...arbeidsgiver.endringsdokument,
      ...arbeidstaker.endringsdokument,
    ].filter((d) => d.type === DocumentComponentType.LINK);

    expect(linkDocumentComponents).to.have.length(2);
    linkDocumentComponents.forEach((documentComponentLink) =>
      expect(documentComponentLink.texts[0]).to.equal(link)
    );
    expect(videoLink).to.equal(link);
  });

  it("endrer møte med behandler ved submit når behandler er med", () => {
    stubEndreApi(apiMockScope, dialogmote.uuid);
    stubFeatureTogglesApi(apiMockScope);
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    passSkjemaInput();
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    clickButton("Send");

    const endreMutation = queryClient.getMutationCache().getAll()[0];
    const expectedEndring = {
      arbeidsgiver: {
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
        endringsdokument: expectedEndringDocuments.arbeidsgiver(true),
      },
      arbeidstaker: {
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
        endringsdokument: expectedEndringDocuments.arbeidstaker(true),
      },
      behandler: {
        begrunnelse: moteTekster.fritekstTilBehandler,
        endringsdokument: expectedEndringDocuments.behandler(),
      },
      videoLink: endretMote.videolink,
      sted: endretMote.sted,
      tid: endretMote.datoTid,
    };
    expect(endreMutation.options.variables).to.deep.equal(expectedEndring);
  });
  it("forhåndsviser endret tid og sted til arbeidstaker", () => {
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);

    const forhandsvisningEndringArbeidstaker = screen.getByRole("dialog", {
      name: endringSkjemaTexts.forhandsvisningArbeidstakerContentLabel,
    });

    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningArbeidstakerTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedEndringDocuments
      .arbeidstaker()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringArbeidstaker).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser endret tid og sted til arbeidsgiver", () => {
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[1]);

    const forhandsvisningEndringArbeidsgiver = screen.getByRole("dialog", {
      name: endringSkjemaTexts.forhandsvisningArbeidsgiverContentLabel,
    });

    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningArbeidsgiverTitle,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningSubtitle,
      })
    ).to.exist;
    expectedEndringDocuments
      .arbeidsgiver()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringArbeidsgiver).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser endret tid og sted til behandler når behandler er med", () => {
    stubAktivVeilederinfoApi(apiMockScope);
    stubFeatureTogglesApi(apiMockScope);
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    passSkjemaInput();
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    userEvent.click(previewButtons[2]);

    const forhandsvisningEndringBehandler = screen.getByRole("dialog", {
      name: endringSkjemaTexts.forhandsvisningBehandlerContentLabel,
    });

    expect(
      within(forhandsvisningEndringBehandler).getByRole("heading", {
        name: endringSkjemaTexts.forhandsvisningBehandlerTitle,
      })
    ).to.exist;

    expectedEndringDocuments
      .behandler()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningEndringBehandler).getByText(text)).to
          .exist;
      });
  });
});

const renderEndreDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <EndreDialogmoteSkjema dialogmote={dialogmote} />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/endre`,
    [`${dialogmoteRoutePath}/${dialogmote.uuid}/endre`]
  );
};

const passSkjemaInput = () => {
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const begrunnelseArbeidstakerInput = getTextInput(
    "Begrunnelse til arbeidstakeren"
  );
  const begrunnelseArbeidsgiverInput = getTextInput(
    "Begrunnelse til nærmeste leder"
  );
  changeTextInput(datoInput, endretMote.dato);
  fireEvent.blur(datoInput);
  changeTextInput(klokkeslettInput, endretMote.klokkeslett);
  changeTextInput(stedInput, endretMote.sted);
  changeTextInput(videoLinkInput, endretMote.videolink);
  changeTextInput(
    begrunnelseArbeidstakerInput,
    moteTekster.fritekstTilArbeidstaker
  );
  changeTextInput(
    begrunnelseArbeidsgiverInput,
    moteTekster.fritekstTilArbeidsgiver
  );
};
