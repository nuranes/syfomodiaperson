import React from "react";
import Referat, {
  ReferatMode,
  valideringsTexts as referatSkjemaValideringsTexts,
} from "../../src/components/dialogmote/referat/Referat";
import { texts as deltakereSkjemaTexts } from "../../src/components/dialogmote/referat/Deltakere";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import { texts as valideringsTexts } from "../../src/utils/valideringUtils";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import { stubFerdigstillApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  arbeidstaker,
  behandlerDeltakerTekst,
  dialogmote,
  dialogmoteMedBehandler,
  moteTekster,
  narmesteLederNavn,
  veileder,
} from "./testData";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectedReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import {
  MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE,
  MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE,
  MAX_LENGTH_BEHANDLERS_OPPGAVE,
  MAX_LENGTH_KONKLUSJON,
  MAX_LENGTH_SITUASJON,
  MAX_LENGTH_VEILEDERS_OPPGAVE,
} from "@/components/dialogmote/referat/ReferatFritekster";
import { queryClientWithMockData } from "../testQueryClient";
import { getReferatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { NewDialogmoteReferatDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { renderWithRouter } from "../testRouterUtils";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";
import { StoreKey } from "@/hooks/useLocalStorageState";

let queryClient: QueryClient;

describe("ReferatTest", () => {
  let clock: any;
  const today = new Date(Date.now());
  const referatTexts = getReferatTexts(Malform.BOKMAL);

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
    localStorage.setItem(StoreKey.MALFORM, Malform.BOKMAL);
  });

  it("viser arbeidstaker, dato og sted i tittel", () => {
    renderReferat(dialogmote);

    expect(
      screen.getByRole("heading", {
        name: `${arbeidstaker.navn}, 10. mai 2021, Videomøte`,
      })
    ).to.exist;
  });

  it("viser alle deltakere forhåndsutfylt med 'Fra arbeidsgiver' redigerbar og påkrevd", () => {
    renderReferat(dialogmote);

    expect(
      screen.getByRole("heading", { name: `Fra NAV: ${veileder.fulltNavn()}` })
    ).to.exist;
    expect(
      screen.getByRole("heading", {
        name: `Arbeidstaker: ${arbeidstaker.navn}`,
      })
    ).to.exist;
    expect(
      screen.getByRole("heading", {
        name: `Fra arbeidsgiver: ${narmesteLederNavn}`,
      })
    ).to.exist;

    expect(
      screen.getByRole("region", {
        name: "Fra arbeidsgiver: Tatten Tattover",
      })
    ).to.exist;

    const getFraArbeidsgiverInput = () => screen.getByLabelText("Navn");

    // Sjekk at 'Fra arbeidsgiver' valideres
    changeTextInput(getFraArbeidsgiverInput(), "");
    clickButton("Lagre og send");
    expect(screen.getAllByText(valideringsTexts.arbeidsgiverDeltakerMissing)).to
      .not.be.empty;

    // Sjekk at 'Fra arbeidsgiver' kan endres
    const endretFraArbeidsgiver = "Ny Leder";
    changeTextInput(getFraArbeidsgiverInput(), endretFraArbeidsgiver);
    expect(getFraArbeidsgiverInput().getAttribute("value")).to.equal(
      endretFraArbeidsgiver
    );
  });

  it("viser behandler som deltaker når behandler er med", () => {
    renderReferat(dialogmoteMedBehandler);

    expect(screen.getByRole("heading", { name: behandlerDeltakerTekst })).to
      .exist;

    expect(
      screen.getByRole("region", {
        name: behandlerDeltakerTekst,
      })
    ).to.exist;

    const behandlerDeltokInput: HTMLInputElement = screen.getByLabelText(
      deltakereSkjemaTexts.behandlerDeltokLabel
    );
    expect(behandlerDeltokInput.checked).to.be.true;
    const behandlerMottarReferatInput: HTMLInputElement = screen.getByLabelText(
      deltakereSkjemaTexts.behandlerMottaReferatLabel
    );
    expect(behandlerMottarReferatInput.checked).to.be.true;
  });

  it("kan endre behandlers deltakelse", () => {
    stubFerdigstillApi(apiMock(), dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    // Fjern avkrysning på deltakelse og motta referat
    const behandlerDeltokCheckbox: HTMLInputElement = screen.getByLabelText(
      deltakereSkjemaTexts.behandlerDeltokLabel
    );
    userEvent.click(behandlerDeltokCheckbox);
    const behandlerMottaReferatCheckbox: HTMLInputElement =
      screen.getByLabelText(deltakereSkjemaTexts.behandlerMottaReferatLabel);
    userEvent.click(behandlerMottaReferatCheckbox);

    clickButton("Lagre og send");

    // Sjekk behandlers deltakelse-felter og brev
    const ferdigstillMutation = queryClient.getMutationCache().getAll().pop();
    const newReferat = ferdigstillMutation?.state
      .variables as unknown as NewDialogmoteReferatDTO;
    expect(newReferat).to.deep.include({
      behandlerDeltatt: false,
      behandlerMottarReferat: false,
    });
    const documentDeltakereTexts = newReferat.document.find(
      (d) => d.title === referatTexts.deltakereTitle
    )?.texts;
    expect(documentDeltakereTexts).to.deep.include(
      `${behandlerDeltakerTekst}, deltok ikke`
    );
  });

  it("validerer alle fritekstfelter unntatt veileders oppgave", () => {
    renderReferat(dialogmote);

    clickButton("Lagre og send");

    expect(screen.getAllByText(referatSkjemaValideringsTexts.situasjonMissing))
      .to.not.be.empty;
    expect(screen.getAllByText(referatSkjemaValideringsTexts.konklusjonMissing))
      .to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.arbeidstakersOppgaveMissing
      )
    ).to.not.be.empty;
    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.arbeidsgiversOppgaveMissing
      )
    ).to.not.be.empty;

    // Feilmeldinger i oppsummering
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(getFeilmeldingLink(referatSkjemaValideringsTexts.situasjonMissing))
      .to.exist;
    expect(getFeilmeldingLink(referatSkjemaValideringsTexts.konklusjonMissing))
      .to.exist;
    expect(
      getFeilmeldingLink(
        referatSkjemaValideringsTexts.arbeidstakersOppgaveMissing
      )
    ).to.exist;
    expect(
      getFeilmeldingLink(
        referatSkjemaValideringsTexts.arbeidsgiversOppgaveMissing
      )
    ).to.exist;
  });

  it("validerer navn og funksjon på andre deltakere", () => {
    renderReferat(dialogmote);

    clickButton("Pluss ikon Legg til en deltaker");
    clickButton("Lagre og send");

    // Feilmeldinger i skjema
    expect(screen.getAllByText(valideringsTexts.andreDeltakereMissingNavn)).to
      .not.be.empty;
    expect(screen.getAllByText(valideringsTexts.andreDeltakereMissingFunksjon))
      .to.not.be.empty;

    // Feilmelding i oppsummering
    expect(getFeilmeldingLink(valideringsTexts.andreDeltakereMissingNavn)).to
      .exist;
    expect(getFeilmeldingLink(valideringsTexts.andreDeltakereMissingFunksjon))
      .to.exist;

    // Slett deltaker og sjekk at feil forsvinner
    clickButton("Slett ikon");
    expect(screen.queryAllByText(valideringsTexts.andreDeltakereMissingNavn)).to
      .be.empty;
    expect(
      screen.queryAllByText(valideringsTexts.andreDeltakereMissingFunksjon)
    ).to.be.empty;
  });

  it("validerer maks lengde på fritekstfelter", () => {
    renderReferat(dialogmoteMedBehandler);

    const situasjonInput = getTextInput("Situasjon og muligheter");
    const konklusjonInput = getTextInput("Konklusjon");
    const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
    const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
    const behandlerInput = getTextInput("Behandlerens oppgave (valgfri):");
    const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
    changeTextInput(situasjonInput, getTooLongText(MAX_LENGTH_SITUASJON));
    changeTextInput(konklusjonInput, getTooLongText(MAX_LENGTH_KONKLUSJON));
    changeTextInput(
      arbeidstakerInput,
      getTooLongText(MAX_LENGTH_ARBEIDSTAKERS_OPPGAVE)
    );
    changeTextInput(
      arbeidsgiverInput,
      getTooLongText(MAX_LENGTH_ARBEIDSGIVERS_OPPGAVE)
    );
    changeTextInput(
      behandlerInput,
      getTooLongText(MAX_LENGTH_BEHANDLERS_OPPGAVE)
    );
    changeTextInput(
      veilederInput,
      getTooLongText(MAX_LENGTH_VEILEDERS_OPPGAVE)
    );

    clickButton("Lagre og send");

    expect(
      screen.getAllByRole("link", { name: /tegn tillatt/ })
    ).to.have.length(6, "Validerer maks lengde på alle fritekstfelter");
  });

  it("ferdigstiller dialogmote ved submit av skjema", () => {
    stubFerdigstillApi(apiMock(), dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);

    passSkjemaTekstInput();

    clickButton("Pluss ikon Legg til en deltaker");
    const annenDeltakerNavnInput = getTextInput("Navn");
    const annenDeltakerFunksjonInput = getTextInput("Funksjon");
    changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
    changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);

    clickButton("Lagre og send");

    const ferdigstillMutation = queryClient.getMutationCache().getAll().pop();
    const expectedFerdigstilling = {
      narmesteLederNavn: narmesteLederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
      behandlerDeltatt: true,
      behandlerMottarReferat: true,
      behandlerOppgave: moteTekster.behandlersOppgave,
      veilederOppgave: moteTekster.veiledersOppgave,
      document: expectedReferatDocument(),
      andreDeltakere: [
        { funksjon: annenDeltakerFunksjon, navn: annenDeltakerNavn },
      ],
    };
    expect(ferdigstillMutation?.state.variables).to.deep.equal(
      expectedFerdigstilling
    );
  });

  it("forhåndsviser referat", () => {
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    clickButton("Pluss ikon Legg til en deltaker");
    const annenDeltakerNavnInput = getTextInput("Navn");
    const annenDeltakerFunksjonInput = getTextInput("Funksjon");
    changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
    changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);

    clickButton("Se forhåndsvisning");
    const forhandsvisningReferat = screen.getByRole("dialog", {
      hidden: true,
    });

    expectedReferatDocument()
      .flatMap((documentComponent) => documentComponent.texts)
      .forEach((text) => {
        expect(within(forhandsvisningReferat).getByText(text)).to.exist;
      });
  });

  it("forhåndsviser referat med nynorsktekster hvis dette er valgt", () => {
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();

    const malformRadioNynorsk = screen.getByRole("radio", {
      name: "Nynorsk",
    });
    userEvent.click(malformRadioNynorsk);

    clickButton("Se forhåndsvisning");

    expect(screen.getByText(getReferatTexts(Malform.NYNORSK).intro2)).to.exist;
  });
});

const renderReferat = (dialogmoteDTO: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <MalformProvider>
        <Referat
          dialogmote={dialogmoteDTO}
          pageTitle="Test"
          mode={ReferatMode.NYTT}
        />
      </MalformProvider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/referat`,
    [`${dialogmoteRoutePath}/${dialogmoteDTO.uuid}/referat`]
  );
};

const passSkjemaTekstInput = () => {
  const situasjonInput = getTextInput("Situasjon og muligheter");
  const konklusjonInput = getTextInput("Konklusjon");
  const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
  const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
  const behandlerInput = getTextInput("Behandlerens oppgave (valgfri):");
  const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(behandlerInput, moteTekster.behandlersOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
