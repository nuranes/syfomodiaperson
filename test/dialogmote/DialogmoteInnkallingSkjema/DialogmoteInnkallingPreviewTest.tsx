import { QueryClientProvider } from "@tanstack/react-query";
import {
  arbeidsgiver,
  arbeidstaker,
  behandler,
  mote,
  moteTekster,
  navEnhet,
} from "../testData";
import { fireEvent, screen, within } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import React from "react";
import { changeTextInput, getTextInput } from "../../testUtils";
import { expectedInnkallingDocuments } from "../testDataDocuments";
import { queryClientWithMockData } from "../../testQueryClient";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { behandlereQueryKeys } from "@/data/behandler/behandlereQueryHooks";
import { renderWithRouter } from "../../testRouterUtils";
import { stubFeatureTogglesApi } from "../../stubs/stubUnleash";
import { apiMock } from "../../stubs/stubApi";
import { MalformProvider } from "@/context/malform/MalformContext";
import {
  DialogmoteInnkallingSkjema,
  texts,
} from "@/components/dialogmote/innkalling/DialogmoteInnkallingSkjema";

let queryClient: any;
let mockApiScope;

describe("Dialogmoteinnkallingskjema forhåndsvisning", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
    mockApiScope = apiMock();
  });

  it("previews innkalling to arbeidstaker", () => {
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[0]);
    const forhandsvisningInnkallingArbeidstaker = screen.getAllByRole(
      "dialog",
      {
        hidden: true,
      }
    )[1];

    expect(
      within(forhandsvisningInnkallingArbeidstaker).getByRole("heading", {
        name: texts.forhandsvisningArbeidstakerTitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningInnkallingArbeidstaker).getByRole("heading", {
        name: texts.forhandsvisningSubtitle,
        hidden: true,
      })
    ).to.exist;
    expectedInnkallingDocuments
      .arbeidstaker()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningInnkallingArbeidstaker).getByText(text)).to
          .exist;
      });
  });

  it("previews innkalling to arbeidsgiver", () => {
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(2);
    userEvent.click(previewButtons[1]);
    const forhandsvisningInnkallingArbeidsgiver = screen.getAllByRole(
      "dialog",
      {
        hidden: true,
      }
    )[2];

    expect(
      within(forhandsvisningInnkallingArbeidsgiver).getByRole("heading", {
        name: texts.forhandsvisningSubtitle,
        hidden: true,
      })
    ).to.exist;
    expect(
      within(forhandsvisningInnkallingArbeidsgiver).getByRole("heading", {
        name: texts.forhandsvisningArbeidsgiverTitle,
        hidden: true,
      })
    ).to.exist;
    expectedInnkallingDocuments
      .arbeidsgiver()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningInnkallingArbeidsgiver).getByText(text)).to
          .exist;
      });
  });

  it("previews innkalling to behandler", () => {
    stubFeatureTogglesApi(mockApiScope);
    queryClient.setQueryData(
      behandlereQueryKeys.behandlere(arbeidstaker.personident),
      () => [behandler]
    );
    renderDialogmoteInnkallingSkjema();
    passSkjemaInput();

    const fastlegeInput = screen.getByRole("radio", { name: /Fastlege/ });
    userEvent.click(fastlegeInput);
    const fritekstBehandlerInput = getTextInput(
      "Fritekst til behandler (valgfri)"
    );
    changeTextInput(fritekstBehandlerInput, moteTekster.fritekstTilBehandler);

    const previewButtons = screen.getAllByRole("button", {
      name: "Forhåndsvisning",
    });
    expect(previewButtons).to.have.length(3);
    userEvent.click(previewButtons[2]);
    const forhandsvisningInnkallingBehandler = screen.getAllByRole("dialog", {
      hidden: true,
    })[3];

    expect(
      within(forhandsvisningInnkallingBehandler).getByRole("heading", {
        name: texts.forhandsvisningBehandlerTitle,
        hidden: true,
      })
    ).to.exist;

    expectedInnkallingDocuments
      .behandler()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningInnkallingBehandler).getByText(text)).to
          .exist;
      });
  });
});

const renderDialogmoteInnkallingSkjema = () =>
  renderWithRouter(
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

const passSkjemaInput = () => {
  const virksomhetSelect = screen.getByRole("radio", {
    name: `Fant ikke virksomhetsnavn for ${arbeidsgiver.orgnr}`,
  });
  const datoInput = getTextInput("Dato");
  const klokkeslettInput = screen.getByLabelText("Klokkeslett");
  const stedInput = getTextInput("Sted");
  const videoLinkInput = getTextInput("Lenke til videomøte (valgfritt)");
  const fritekstArbeidstakerInput = getTextInput(
    "Fritekst til arbeidstakeren (valgfri)"
  );
  const fritekstArbeidsgiverInput = getTextInput(
    "Fritekst til nærmeste leder (valgfri)"
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
};
