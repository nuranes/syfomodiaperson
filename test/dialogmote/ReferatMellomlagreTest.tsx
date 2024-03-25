import React from "react";
import Referat, {
  ReferatMode,
} from "../../src/components/dialogmote/referat/Referat";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { expect } from "chai";
import { changeTextInput, clickButton, getTextInput } from "../testUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import {
  annenDeltakerFunksjon,
  annenDeltakerNavn,
  dialogmoteMedBehandler,
  dialogmoteMedMellomlagretReferat,
  dialogmoteMedMellomlagretReferatBehandlerIkkeDeltatt,
  moteTekster,
  narmesteLederNavn,
  referatStandardTekst,
} from "./testData";
import { screen } from "@testing-library/react";
import { expectedReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import { stubMellomlagreApi } from "../stubs/stubIsdialogmote";
import { apiMock } from "../stubs/stubApi";
import { queryClientWithMockData } from "../testQueryClient";
import { texts as deltakereSkjemaTexts } from "@/components/dialogmote/referat/Deltakere";
import { renderWithRouter } from "../testRouterUtils";
import { MalformProvider } from "@/context/malform/MalformContext";

let queryClient: QueryClient;

describe("ReferatMellomlagreTest", () => {
  let clock: any;
  const today = new Date(Date.now());

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("lagrer referat med verdier fra skjema", () => {
    stubMellomlagreApi(apiMock(), dialogmoteMedBehandler.uuid);
    renderReferat(dialogmoteMedBehandler);
    passSkjemaTekstInput();
    clickButton("Lagre");

    const mellomlagreMutation = queryClient.getMutationCache().getAll().pop();
    const expectedReferat = {
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
    expect(mellomlagreMutation?.state.variables).to.deep.equal(expectedReferat);
  });

  it("preutfyller referat-skjema fra dialogmote med mellomlagret referat", () => {
    renderReferat(dialogmoteMedMellomlagretReferat);

    expect(screen.getByDisplayValue(narmesteLederNavn)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.situasjonTekst)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidsgiversOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidstakersOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.konklusjonTekst)).to.exist;
    expect(screen.getByDisplayValue(annenDeltakerNavn)).to.exist;
    expect(screen.getByDisplayValue(annenDeltakerFunksjon)).to.exist;
    const checkedStandardtekst = screen.getByRole("checkbox", {
      checked: true,
      name: referatStandardTekst.label,
    });
    expect(checkedStandardtekst).to.exist;
  });

  it("preutfyller referat-skjema behandler-deltakelse fra dialogmote", () => {
    renderReferat(dialogmoteMedMellomlagretReferatBehandlerIkkeDeltatt);

    const behandlerDeltokInput: HTMLInputElement = screen.getByLabelText(
      deltakereSkjemaTexts.behandlerDeltokLabel
    );
    expect(behandlerDeltokInput.checked).to.be.false;
    const behandlerMottarReferatInput: HTMLInputElement = screen.getByLabelText(
      deltakereSkjemaTexts.behandlerMottaReferatLabel
    );
    expect(behandlerMottarReferatInput.checked).to.be.false;
  });
});

const renderReferat = (dialogmoteDTO: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <MalformProvider>
        <Referat dialogmote={dialogmoteDTO} mode={ReferatMode.NYTT} />
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

  clickButton("Pluss ikon Legg til en deltaker");
  const annenDeltakerNavnInput = getTextInput("Navn");
  const annenDeltakerFunksjonInput = getTextInput("Funksjon");

  changeTextInput(annenDeltakerNavnInput, annenDeltakerNavn);
  changeTextInput(annenDeltakerFunksjonInput, annenDeltakerFunksjon);
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(behandlerInput, moteTekster.behandlersOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
