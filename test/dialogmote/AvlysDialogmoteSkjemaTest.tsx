import React from "react";
import { expect } from "chai";
import AvlysDialogmoteSkjema, {
  MAX_LENGTH_AVLYS_BEGRUNNELSE,
  texts as avlysningSkjemaTexts,
} from "@/sider/mote/components/avlys/AvlysDialogmoteSkjema";
import { texts as valideringsTexts } from "@/utils/valideringUtils";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
  maxLengthErrorMessage,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubAvlysApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import { dialogmote, dialogmoteMedBehandler, moteTekster } from "./testData";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedAvlysningDocuments } from "./testDataDocuments";
import sinon from "sinon";
import { queryClientWithMockData } from "../testQueryClient";
import { renderWithRouter } from "../testRouterUtils";

let queryClient: QueryClient;

describe("AvlysDialogmoteSkjemaTest", () => {
  let clock: any;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("viser møtetidspunkt", () => {
    renderAvlysDialogmoteSkjema(dialogmote);

    expect(screen.getByText("Gjelder dialogmøtet")).to.exist;
    expect(screen.getByText("Mandag 10. mai 2021 kl. 09.00")).to.exist;
  });
  it("validerer begrunnelser", () => {
    renderAvlysDialogmoteSkjema(dialogmote);
    clickButton("Send");

    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);
    clickButton("Send");

    expect(screen.getAllByText(valideringsTexts.begrunnelseBehandlerMissing)).to
      .not.be.empty;

    // Feilmelding i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseBehandlerMissing)).to
      .exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", () => {
    renderAvlysDialogmoteSkjema(dialogmote);
    clickButton("Send");
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidsgiverMissing))
      .to.exist;

    // Angi begrunnelser
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

    // Feilmeldinger og feiloppsummering forsvinner
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidstakerMissing)
    ).to.be.empty;
    expect(
      screen.queryAllByText(valideringsTexts.begrunnelseArbeidsgiverMissing)
    ).to.be.empty;

    // Fjern begrunnelser
    changeTextInput(begrunnelseArbeidstakerInput, "");
    changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises, feiloppsummering vises ved neste submit
    expect(screen.getAllByText(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.be.empty;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.not.exist;

    clickButton("Send");
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
    expect(getFeilmeldingLink(valideringsTexts.begrunnelseArbeidstakerMissing))
      .to.exist;
  });
  it("validerer maks lengde på begrunnelser", () => {
    const tooLongFritekst = getTooLongText(MAX_LENGTH_AVLYS_BEGRUNNELSE);
    const maxLengthErrorMsg = maxLengthErrorMessage(
      MAX_LENGTH_AVLYS_BEGRUNNELSE
    );
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

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
  it("avlyser møte ved submit", () => {
    stubAvlysApi(apiMock(), dialogmote.uuid);
    renderAvlysDialogmoteSkjema(dialogmote);

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

    clickButton("Send");

    const avlysMutation = queryClient.getMutationCache().getAll()[0];
    const expectedAvlysningDto = {
      arbeidsgiver: {
        avlysning: expectedAvlysningDocuments.arbeidsgiver(),
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
      },
      arbeidstaker: {
        avlysning: expectedAvlysningDocuments.arbeidstaker(),
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
      },
    };
    expect(avlysMutation.state.variables).to.deep.equal(expectedAvlysningDto);
  });
  it("avlyser med behandler ved submit når behandler er med", () => {
    stubAvlysApi(apiMock(), dialogmote.uuid);
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    clickButton("Send");

    const avlysMutation = queryClient.getMutationCache().getAll()[0];
    const expectedAvlysningDto = {
      arbeidsgiver: {
        avlysning: expectedAvlysningDocuments.arbeidsgiver(),
        begrunnelse: moteTekster.fritekstTilArbeidsgiver,
      },
      arbeidstaker: {
        avlysning: expectedAvlysningDocuments.arbeidstaker(),
        begrunnelse: moteTekster.fritekstTilArbeidstaker,
      },
      behandler: {
        avlysning: expectedAvlysningDocuments.behandler(),
        begrunnelse: moteTekster.fritekstTilBehandler,
      },
    };
    expect(avlysMutation.state.variables).to.deep.equal(expectedAvlysningDto);
  });
  it("forhåndsviser avlysning til arbeidstaker", async () => {
    renderAvlysDialogmoteSkjema(dialogmote);

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

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);

    const forhandsvisningAvlysningArbeidstaker = screen.getAllByRole("dialog", {
      hidden: true,
    })[0];

    expect(
      within(forhandsvisningAvlysningArbeidstaker).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningArbeidstakerTitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningAvlysningArbeidstaker).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningSubtitle,
        hidden: true,
      })
    ).to.exist;
    expectedAvlysningDocuments
      .arbeidstaker()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningAvlysningArbeidstaker).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser avlysning til arbeidsgiver", () => {
    renderAvlysDialogmoteSkjema(dialogmote);

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

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[1]);

    const forhandsvisningAvlysningArbeidsgiver = screen.getAllByRole("dialog", {
      hidden: true,
    })[1];
    expect(
      within(forhandsvisningAvlysningArbeidsgiver).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningArbeidsgiverTitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningAvlysningArbeidsgiver).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningSubtitle,
        hidden: true,
      })
    ).to.exist;
    expectedAvlysningDocuments
      .arbeidsgiver()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningAvlysningArbeidsgiver).getByText(text)).to
          .exist;
      });
  });
  it("forhåndsviser avlysning til behandler når behandler er med", () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );
    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    changeTextInput(
      begrunnelseArbeidstakerInput,
      moteTekster.fritekstTilArbeidstaker
    );
    changeTextInput(
      begrunnelseArbeidsgiverInput,
      moteTekster.fritekstTilArbeidsgiver
    );
    changeTextInput(
      begrunnelseBehandlerInput,
      moteTekster.fritekstTilBehandler
    );

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    userEvent.click(previewButtons[2]);

    const forhandsvisningAvlysningBehandler = screen.getAllByRole("dialog", {
      hidden: true,
    })[2];
    expect(
      within(forhandsvisningAvlysningBehandler).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningBehandlerTitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningAvlysningBehandler).getByRole("heading", {
        name: avlysningSkjemaTexts.forhandsvisningSubtitle,
        hidden: true,
      })
    ).to.exist;
    expectedAvlysningDocuments
      .behandler()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningAvlysningBehandler).getByText(text)).to
          .exist;
      });
  });
});

const renderAvlysDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <AvlysDialogmoteSkjema dialogmote={dialogmote} pageTitle="test" />
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/avlys`,
    [`${dialogmoteRoutePath}/123abc/avlys`]
  );
};
