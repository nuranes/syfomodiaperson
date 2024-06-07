import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import EndreDialogmoteSkjema from "@/sider/dialogmoter/components/endre/EndreDialogmoteSkjema";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { expect, describe, it, beforeEach, afterEach } from "vitest";
import { apiMock } from "../stubs/stubApi";
import { stubEndreApi } from "../stubs/stubIsdialogmote";
import { texts } from "@/sider/dialogmoter/components/endre/EndreDialogmoteSkjema";
import {
  dialogmote,
  dialogmoteMedBehandler,
  endretMote,
  moteTekster,
  navEnhet,
} from "./testData";
import {
  DialogmoteDTO,
  EndreTidStedDialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MAX_LENGTH_ENDRE_BEGRUNNELSE } from "@/sider/dialogmoter/components/endre/EndreDialogmoteSkjema";
import { expectedEndringDocuments } from "./testDataDocuments";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { renderWithRouter } from "../testRouterUtils";
import { stubFeatureTogglesApi } from "../stubs/stubUnleash";
import { stubAktivVeilederinfoApi } from "../stubs/stubSyfoveileder";
import { queryClientWithMockData } from "../testQueryClient";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";
import { getEndreTidStedTexts } from "@/data/dialogmote/dialogmoteTexts";
import { StoreKey } from "@/hooks/useLocalStorageState";

let queryClient: QueryClient;
let apiMockScope;

describe("EndreDialogmoteSkjemaTest", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    apiMockScope = apiMock();
  });

  afterEach(() => {
    localStorage.setItem(StoreKey.MALFORM, Malform.BOKMAL);
  });

  it("validerer begrunnelser og dato", async () => {
    renderEndreDialogmoteSkjema(dialogmote);

    clickButton("Send");

    expect(await screen.findByText(texts.begrunnelseArbeidstakerMissing)).to
      .exist;
    expect(await screen.findByText(texts.begrunnelseArbeidsgiverMissing)).to
      .exist;
    expect(await screen.findByText(/Tidspunktet har passert/)).to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", async () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);

    clickButton("Send");

    expect(await screen.findByText(texts.begrunnelseBehandlerMissing)).to.exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderEndreDialogmoteSkjema(dialogmote);

    clickButton("Send");

    expect(await screen.findByText(texts.begrunnelseArbeidstakerMissing)).to
      .exist;
    expect(await screen.findByText(texts.begrunnelseArbeidsgiverMissing)).to
      .exist;
    expect(await screen.findByText(/Tidspunktet har passert/)).to.exist;

    // Angi dato og begrunnelser
    const datoInput = screen.getByRole("textbox", {
      name: "Dato",
      hidden: true,
    });
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
    clickButton("Send");

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(screen.queryByText(texts.begrunnelseArbeidstakerMissing)).to.not
        .exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(texts.begrunnelseArbeidsgiverMissing)).to.not
        .exist;
    });
    await waitFor(() => {
      expect(screen.queryByText(/Tidspunktet har passert/)).to.not.exist;
    });

    // Fjern begrunnelser
    changeTextInput(begrunnelseArbeidstakerInput, "");
    changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises
    expect(await screen.findByText(texts.begrunnelseArbeidstakerMissing)).to
      .exist;
    expect(await screen.findByText(texts.begrunnelseArbeidsgiverMissing)).to
      .exist;
  });
  it("validerer maks lengde på begrunnelser", async () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );

    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    const tooLongFritekst = getTooLongText(MAX_LENGTH_ENDRE_BEGRUNNELSE);
    changeTextInput(begrunnelseArbeidstakerInput, tooLongFritekst);
    changeTextInput(begrunnelseArbeidsgiverInput, tooLongFritekst);
    changeTextInput(begrunnelseBehandlerInput, tooLongFritekst);

    clickButton("Send");

    expect(await screen.findAllByText("1 tegn for mye")).to.not.be.empty;
  });

  it("endrer møte ved submit", async () => {
    stubEndreApi(apiMockScope, dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    clickButton("Send");

    await waitFor(() => {
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
      expect(endreMutation.state.variables).to.deep.equal(expectedEndring);
    });
  });

  it("trimmer videolenke i endring som sendes til api", async () => {
    stubEndreApi(apiMockScope, dialogmote.uuid);
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const link = "https://video.nav.no/abc";
    const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
    const linkWithWhitespace = `   ${link}  `;
    changeTextInput(videoLinkInput, linkWithWhitespace);

    clickButton("Send");

    let endreMutation;
    await waitFor(() => {
      endreMutation = queryClient.getMutationCache().getAll()[0];
      expect(endreMutation).to.exist;
    });

    const { videoLink, arbeidsgiver, arbeidstaker } = endreMutation.state
      .variables as unknown as EndreTidStedDialogmoteDTO;

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

  it("endrer møte med behandler ved submit når behandler er med", async () => {
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

    await waitFor(() => {
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
      expect(endreMutation.state.variables).to.deep.equal(expectedEndring);
    });
  });
  it("forhåndsviser endret tid og sted til arbeidstaker", () => {
    renderEndreDialogmoteSkjema(dialogmote);
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);

    const forhandsvisningEndringArbeidstaker = screen.getAllByRole("dialog", {
      hidden: true,
    })[1];

    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: texts.forhandsvisningArbeidstakerTitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidstaker).getByRole("heading", {
        name: texts.forhandsvisningSubtitle,
        hidden: true,
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

    const forhandsvisningEndringArbeidsgiver = screen.getAllByRole("dialog", {
      hidden: true,
    })[2];

    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: texts.forhandsvisningArbeidsgiverTitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningEndringArbeidsgiver).getByRole("heading", {
        name: texts.forhandsvisningSubtitle,
        hidden: true,
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

    const forhandsvisningEndringBehandler = screen.getAllByRole("dialog", {
      hidden: true,
    })[3];

    expect(
      within(forhandsvisningEndringBehandler).getByRole("heading", {
        name: texts.forhandsvisningBehandlerTitle,
        hidden: true,
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

  it("forhåndsviser endring med nynorsktekster hvis dette er valgt", () => {
    renderEndreDialogmoteSkjema(dialogmoteMedBehandler);
    passSkjemaInput();

    const malformRadioNynorsk = screen.getByRole("radio", {
      name: "Nynorsk",
    });
    userEvent.click(malformRadioNynorsk);

    const forhandsvisningButton = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    })[0];
    userEvent.click(forhandsvisningButton);

    expect(screen.getByText(getEndreTidStedTexts(Malform.NYNORSK).intro2)).to
      .exist;
  });
});

const renderEndreDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <MalformProvider>
          <EndreDialogmoteSkjema dialogmote={dialogmote} />
        </MalformProvider>
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
