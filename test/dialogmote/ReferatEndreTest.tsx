import React from "react";
import Referat, {
  ReferatMode,
  valideringsTexts as referatSkjemaValideringsTexts,
} from "../../src/components/dialogmote/referat/Referat";
import { expect } from "chai";
import { texts as skjemaFeilOppsummeringTexts } from "../../src/components/SkjemaFeiloppsummering";
import {
  changeTextInput,
  clickButton,
  getFeilmeldingLink,
  getTextInput,
  getTooLongText,
} from "../testUtils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { dialogmoteRoutePath } from "@/routers/AppRouter";
import {
  dialogmoteMedFerdigstiltReferat,
  dialogmoteMedMellomlagretReferat,
  moteTekster,
  narmesteLederNavn,
} from "./testData";
import { screen, within } from "@testing-library/react";
import { expectedEndretReferatDocument } from "./testDataDocuments";
import sinon from "sinon";
import { MAX_LENGTH_BEGRUNNELSE_ENDRING } from "@/components/dialogmote/referat/ReferatFritekster";
import { queryClientWithMockData } from "../testQueryClient";
import { getReferatTexts } from "@/data/dialogmote/dialogmoteTexts";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { renderWithRouter } from "../testRouterUtils";
import { Malform, MalformProvider } from "@/context/malform/MalformContext";

let queryClient: QueryClient;

describe("ReferatEndreTest", () => {
  let clock: any;
  const today = new Date(Date.now());
  const referatTexts = getReferatTexts(Malform.BOKMAL);

  beforeEach(() => {
    queryClient = queryClientWithMockData();
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  it("validerer begrunnelse for endring", () => {
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);

    clickButton("Lagre og send");

    expect(
      screen.getAllByText(
        referatSkjemaValideringsTexts.begrunnelseEndringMissing
      )
    ).to.not.be.empty;
    expect(screen.getByText(skjemaFeilOppsummeringTexts.title)).to.exist;
    expect(
      getFeilmeldingLink(
        referatSkjemaValideringsTexts.begrunnelseEndringMissing
      )
    ).to.exist;

    const begrunnelseInput = getTextInput("Årsaken til at referatet må endres");
    changeTextInput(
      begrunnelseInput,
      getTooLongText(MAX_LENGTH_BEGRUNNELSE_ENDRING)
    );
    clickButton("Lagre og send");
    expect(screen.getByRole("link", { name: /tegn tillatt/ })).to.exist;
  });

  it("preutfyller skjema fra ferdigstilt referat", () => {
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);

    expect(screen.getByDisplayValue(narmesteLederNavn)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.situasjonTekst)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidsgiversOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.arbeidstakersOppgave)).to.exist;
    expect(screen.getByDisplayValue(moteTekster.konklusjonTekst)).to.exist;
  });

  it("preutfyller skjema med begrunnelse for endring fra mellomlagret endret referat", () => {
    renderEndreReferat(dialogmoteMedMellomlagretReferat);

    expect(screen.getByDisplayValue(moteTekster.begrunnelseEndring)).to.exist;
  });

  it("forhåndsviser endret referat", () => {
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);
    passSkjemaInput();

    clickButton("Se forhåndsvisning");

    const forhandsvisningReferat = screen.getByRole("dialog", {
      hidden: true,
    });

    expect(within(forhandsvisningReferat).getByText(referatTexts.endretHeader))
      .to.exist;
    expect(within(forhandsvisningReferat).getByText(referatTexts.endring)).to
      .exist;
    expect(
      within(forhandsvisningReferat).getByText(
        referatTexts.begrunnelseEndringTitle
      )
    ).to.exist;
    expect(
      within(forhandsvisningReferat).getByText(moteTekster.begrunnelseEndring)
    ).to.exist;
  });

  it("endrer ferdigstilling av dialogmote ved submit av skjema", () => {
    renderEndreReferat(dialogmoteMedFerdigstiltReferat);
    passSkjemaInput();
    clickButton("Lagre og send");

    const endringFerdigstillMutation = queryClient
      .getMutationCache()
      .getAll()
      .pop();
    const expectedEndringFerdigstilling = {
      narmesteLederNavn: narmesteLederNavn,
      situasjon: moteTekster.situasjonTekst,
      konklusjon: moteTekster.konklusjonTekst,
      arbeidsgiverOppgave: moteTekster.arbeidsgiversOppgave,
      arbeidstakerOppgave: moteTekster.arbeidstakersOppgave,
      begrunnelseEndring: moteTekster.begrunnelseEndring,
      veilederOppgave: moteTekster.veiledersOppgave,
      document: expectedEndretReferatDocument(),
      andreDeltakere: [],
    };
    expect(endringFerdigstillMutation?.state.variables).to.deep.equal(
      expectedEndringFerdigstilling
    );
  });
});

const renderEndreReferat = (dialogmote: DialogmoteDTO) => {
  return renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <MalformProvider>
        <Referat
          dialogmote={dialogmote}
          pageTitle="Test"
          mode={ReferatMode.ENDRET}
        />
      </MalformProvider>
    </QueryClientProvider>,
    `${dialogmoteRoutePath}/:dialogmoteUuid/referat/endre`,
    [`${dialogmoteRoutePath}/${dialogmote.uuid}/referat/endre`]
  );
};

const passSkjemaInput = () => {
  const begrunnelseInput = getTextInput("Årsaken til at referatet må endres");
  const situasjonInput = getTextInput("Situasjon og muligheter");
  const konklusjonInput = getTextInput("Konklusjon");
  const arbeidstakerInput = getTextInput("Arbeidstakerens oppgave:");
  const arbeidsgiverInput = getTextInput("Arbeidsgiverens oppgave:");
  const veilederInput = getTextInput("Veilederens oppgave (valgfri):");
  changeTextInput(begrunnelseInput, moteTekster.begrunnelseEndring);
  changeTextInput(situasjonInput, moteTekster.situasjonTekst);
  changeTextInput(konklusjonInput, moteTekster.konklusjonTekst);
  changeTextInput(arbeidstakerInput, moteTekster.arbeidstakersOppgave);
  changeTextInput(arbeidsgiverInput, moteTekster.arbeidsgiversOppgave);
  changeTextInput(veilederInput, moteTekster.veiledersOppgave);
};
