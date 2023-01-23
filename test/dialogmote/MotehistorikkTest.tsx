import React from "react";
import { expect } from "chai";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { MotehistorikkPanel } from "@/components/dialogmote/motehistorikk/MotehistorikkPanel";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  ENHET_GRUNERLOKKA,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { createFerdigstiltReferat } from "./testData";
import {
  dialogmoteunntakMedBeskrivelse,
  dialogmoteunntakUtenBeskrivelse,
} from "../../mock/isdialogmotekandidat/dialogmoteunntakMock";
import { unntakLenkeText } from "@/components/dialogmote/motehistorikk/MoteHistorikkUnntak";
import { testQueryClient } from "../testQueryClient";

let queryClient: any;
const ferdigstiltMoteTid = "2021-01-15T11:52:13.539843";
const ferdigstiltMote = {
  uuid: "1",
  createdAt: "2021-05-26T12:56:26.238385",
  updatedAt: "2021-05-26T12:56:26.238385",
  status: DialogmoteStatus.FERDIGSTILT,
  opprettetAv: VEILEDER_IDENT_DEFAULT,
  tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
  arbeidstaker: {
    personIdent: "12345678912",
    type: "ARBEIDSTAKER",
    varselList: [
      {
        uuid: "123",
        createdAt: "2021-05-26T12:56:26.271381",
        varselType: MotedeltakerVarselType.INNKALT,
        digitalt: true,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum arbeidstaker",
        document: [],
      },
    ],
  },
  arbeidsgiver: {
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: "ARBEIDSGIVER",
    varselList: [
      {
        uuid: "456",
        createdAt: "2021-05-26T12:56:26.282386",
        varselType: MotedeltakerVarselType.INNKALT,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum arbeidsgiver",
        document: [],
        status: "Status",
      },
    ],
  },
  sted: "Sted",
  tid: ferdigstiltMoteTid,
  referatList: [createFerdigstiltReferat(ferdigstiltMoteTid)],
};
const avlystMote = {
  uuid: "10",
  createdAt: "2020-05-26T12:56:26.238385",
  updatedAt: "2020-05-26T12:56:26.238385",
  status: DialogmoteStatus.AVLYST,
  opprettetAv: VEILEDER_IDENT_DEFAULT,
  tildeltVeilederIdent: VEILEDER_IDENT_DEFAULT,
  tildeltEnhet: ENHET_GRUNERLOKKA.nummer,
  arbeidstaker: {
    personIdent: "12345678912",
    type: "ARBEIDSTAKER",
    varselList: [
      {
        uuid: "abc",
        createdAt: "2021-05-26T12:56:26.271381",
        varselType: MotedeltakerVarselType.AVLYST,
        digitalt: true,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum arbeidstaker",
        document: [],
      },
    ],
  },
  arbeidsgiver: {
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    type: "ARBEIDSGIVER",
    varselList: [
      {
        uuid: "def",
        createdAt: "2021-05-26T12:56:26.282386",
        varselType: MotedeltakerVarselType.AVLYST,
        lestDato: "2021-05-26T12:56:26.271381",
        fritekst: "Ipsum lorum arbeidsgiver",
        document: [],
        status: "Status",
      },
    ],
  },
  sted: "Sted",
  tid: "2020-03-22T11:52:13.539843",
  referatList: [],
};
const dialogmoter: DialogmoteDTO[] = [ferdigstiltMote, avlystMote];

describe("Historiske dialogmøter", () => {
  beforeEach(() => {
    queryClient = testQueryClient();
  });
  it("Fremviser avholdte og avlyste dialogmøter", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MotehistorikkPanel
          dialogmoteunntak={[]}
          historiskeMoter={dialogmoter}
        />
      </QueryClientProvider>
    );

    expect(screen.getByText("Referat fra møte 15. januar 2021")).to.exist;
    expect(screen.getByText("Avlysning av møte 22. mars 2020")).to.exist;
  });
  it("Fremviser alle referater fra ferdigstilt dialogmøte", () => {
    const historiskeMoter: DialogmoteDTO[] = [
      {
        ...ferdigstiltMote,
        referatList: [
          createFerdigstiltReferat(ferdigstiltMote.tid),
          createFerdigstiltReferat(ferdigstiltMote.tid),
        ],
      },
    ];
    render(
      <QueryClientProvider client={queryClient}>
        <MotehistorikkPanel
          dialogmoteunntak={[]}
          historiskeMoter={historiskeMoter}
        />
      </QueryClientProvider>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).to.have.length(2);
    expect(buttons[0].textContent).to.equal(
      "Referat fra møte 15. januar 2021 - Endret 15. januar 2021"
    );
    expect(buttons[1].textContent).to.equal("Referat fra møte 15. januar 2021");
  });
  it("Fremviser dialogmoteunntak", () => {
    const dialogmoteunntakListe = [
      {
        ...dialogmoteunntakMedBeskrivelse,
        createdAt: new Date("2020-04-20T12:56:26.271381"),
      },
      {
        ...dialogmoteunntakUtenBeskrivelse,
        createdAt: new Date("2021-05-21T12:56:26.271381"),
      },
    ];
    render(
      <QueryClientProvider client={queryClient}>
        <MotehistorikkPanel
          dialogmoteunntak={dialogmoteunntakListe}
          historiskeMoter={[]}
        />
      </QueryClientProvider>
    );

    dialogmoteunntakListe.forEach((dialogmoteunntak) => {
      expect(screen.getByText(unntakLenkeText(dialogmoteunntak.createdAt))).to
        .exist;
    });
  });
});
