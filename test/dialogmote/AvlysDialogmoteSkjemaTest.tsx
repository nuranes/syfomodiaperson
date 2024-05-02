import React from "react";
import { expect } from "chai";
import AvlysDialogmoteSkjema, {
  MAX_LENGTH_AVLYS_BEGRUNNELSE,
  texts as avlysningSkjemaTexts,
} from "@/sider/dialogmoter/components/avlys/AvlysDialogmoteSkjema";
import {
  changeTextInput,
  clickButton,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubAvlysApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import { dialogmote, dialogmoteMedBehandler, moteTekster } from "./testData";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedAvlysningDocuments } from "./testDataDocuments";
import { queryClientWithMockData } from "../testQueryClient";
import { renderWithRouter } from "../testRouterUtils";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";
import { getAvlysningTexts } from "@/data/dialogmote/dialogmoteTexts";
import { StoreKey } from "@/hooks/useLocalStorageState";

let queryClient: QueryClient;

describe("AvlysDialogmoteSkjemaTest", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  afterEach(() => {
    localStorage.setItem(StoreKey.MALFORM, Malform.BOKMAL);
  });

  it("viser møtetidspunkt", () => {
    renderAvlysDialogmoteSkjema(dialogmote);

    expect(screen.getByText("Gjelder dialogmøtet")).to.exist;
    expect(screen.getByText("Mandag 10. mai 2021 kl. 09.00")).to.exist;
  });
  it("validerer begrunnelser", async () => {
    renderAvlysDialogmoteSkjema(dialogmote);
    clickButton("Send");

    expect(
      await screen.findByText(
        avlysningSkjemaTexts.begrunnelseArbeidstakerMissing
      )
    ).to.exist;
    expect(
      await screen.findByText(
        avlysningSkjemaTexts.begrunnelseArbeidsgiverMissing
      )
    ).to.exist;
  });
  it("validerer begrunnelse til behandler når behandler er med", async () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);
    clickButton("Send");

    expect(
      await screen.findByText(avlysningSkjemaTexts.begrunnelseBehandlerMissing)
    ).to.exist;
  });
  it("valideringsmeldinger forsvinner ved utbedring", async () => {
    renderAvlysDialogmoteSkjema(dialogmote);
    clickButton("Send");
    expect(
      await screen.findByText(
        avlysningSkjemaTexts.begrunnelseArbeidstakerMissing
      )
    ).to.exist;
    expect(
      await screen.findByText(
        avlysningSkjemaTexts.begrunnelseArbeidsgiverMissing
      )
    ).to.exist;

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

    // Feilmeldinger forsvinner
    await waitFor(() => {
      expect(
        screen.queryByText(avlysningSkjemaTexts.begrunnelseArbeidstakerMissing)
      ).to.not.exist;
    });
    await waitFor(() => {
      expect(
        screen.queryByText(avlysningSkjemaTexts.begrunnelseArbeidsgiverMissing)
      ).to.not.exist;
    });

    // Fjern begrunnelser
    changeTextInput(begrunnelseArbeidstakerInput, "");
    changeTextInput(begrunnelseArbeidsgiverInput, "");

    // Feilmeldinger vises
    expect(
      await screen.findByText(
        avlysningSkjemaTexts.begrunnelseArbeidstakerMissing
      )
    ).to.exist;
    expect(
      await screen.findByText(
        avlysningSkjemaTexts.begrunnelseArbeidsgiverMissing
      )
    ).to.exist;
  });
  it("validerer maks lengde på begrunnelser", async () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const begrunnelseArbeidstakerInput = getTextInput(
      "Begrunnelse til arbeidstakeren"
    );

    const begrunnelseArbeidsgiverInput = getTextInput(
      "Begrunnelse til nærmeste leder"
    );
    const begrunnelseBehandlerInput = getTextInput("Begrunnelse til behandler");
    const tooLongFritekst = getTooLongText(MAX_LENGTH_AVLYS_BEGRUNNELSE);
    changeTextInput(begrunnelseArbeidstakerInput, tooLongFritekst);
    changeTextInput(begrunnelseArbeidsgiverInput, tooLongFritekst);
    changeTextInput(begrunnelseBehandlerInput, tooLongFritekst);

    clickButton("Send");

    expect(await screen.findAllByText("1 tegn for mye")).to.not.be.empty;
  });
  it("avlyser møte ved submit", async () => {
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

    await waitFor(() => {
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
  });
  it("avlyser med behandler ved submit når behandler er med", async () => {
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

    await waitFor(() => {
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

  it("forhåndsviser avlysning med nynorsktekster hvis dette er valgt", () => {
    renderAvlysDialogmoteSkjema(dialogmoteMedBehandler);

    const malformRadioNynorsk = screen.getByRole("radio", {
      name: "Nynorsk",
    });
    userEvent.click(malformRadioNynorsk);

    const forhandsvisningButton = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    })[0];
    userEvent.click(forhandsvisningButton);

    expect(
      screen.getByText(getAvlysningTexts(Malform.NYNORSK).intro1, {
        exact: false,
      })
    ).to.exist;
    expect(screen.getByText(getAvlysningTexts(Malform.NYNORSK).header)).to
      .exist;
  });
});

const renderAvlysDialogmoteSkjema = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <MalformProvider>
        <AvlysDialogmoteSkjema dialogmote={dialogmote} pageTitle="test" />
      </MalformProvider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/avlys`,
    [`${dialogmoteRoutePath}/123abc/avlys`]
  );
};
