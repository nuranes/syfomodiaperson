import { expect } from "chai";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import dayjs from "dayjs";
import { InnkallingDialogmotePanel } from "@/sider/mote/components/innkalling/InnkallingDialogmotePanel";
import { texts as brukerKanIkkeVarslesPapirpostTexts } from "../../src/components/dialogmote/BrukerKanIkkeVarslesPapirpostAdvarsel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { createMellomlagretReferat, navEnhet } from "./testData";
import { queryClientWithMockData } from "../testQueryClient";
import { queryButton } from "../testUtils";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { dialogmotekandidatMock } from "../../mock/isdialogmotekandidat/dialogmotekandidatMock";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import {
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import {
  createDialogmote,
  createReferat,
} from "../../mock/isdialogmote/dialogmoterMock";
import { brukerinfoQueryKeys } from "@/data/navbruker/navbrukerQueryHooks";
import { brukerinfoMock } from "../../mock/syfoperson/persondataMock";

let queryClient: QueryClient;

const brukerKanVarsles = {
  ...brukerinfoMock,
  kontaktinfo: {
    ...brukerinfoMock.kontaktinfo,
    skalHaVarsel: true,
  },
};
const brukerKanIkkeVarsles = {
  ...brukerinfoMock,
  kontaktinfo: {
    ...brukerinfoMock.kontaktinfo,
    skalHaVarsel: false,
  },
};

const renderInnkallingDialogmotePanel = (navbruker: any) => {
  queryClient.setQueryData(
    brukerinfoQueryKeys.brukerinfo(ARBEIDSTAKER_DEFAULT.personIdent),
    () => navbruker
  );
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <ValgtEnhetContext.Provider
          value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
        >
          <InnkallingDialogmotePanel aktivtDialogmote={undefined} />
        </ValgtEnhetContext.Provider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe("InnkallingDialogmotePanel", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("med dm2 enabled", () => {
    it("viser advarsel om fysisk brev når bruker ikke kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      expect(screen.getByRole("img", { name: "Advarsel" })).to.exist;
      expect(
        screen.getByText(
          brukerKanIkkeVarslesPapirpostTexts.brukerKanIkkeVarslesTekst
        )
      ).to.exist;
      expect(
        screen.getByText(brukerKanIkkeVarslesPapirpostTexts.papirpostDialogmote)
      ).to.exist;
    });
    it("viser knapp til Dialogmoteinkalling når bruker ikke kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanIkkeVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      userEvent.click(button);
    });

    it("viser ingen advarsel når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(screen.queryByRole("img", { name: "Advarsel" })).to.not.exist;
      expect(
        screen.queryByRole(
          brukerKanIkkeVarslesPapirpostTexts.brukerKanIkkeVarslesTekst
        )
      ).to.not.exist;
    });
    it("viser knapp til Dialogmoteinkalling  når bruker kan varsles", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByRole("button", { name: "Nytt dialogmøte" });
      expect(button).to.exist;
      userEvent.click(button);
    });
    it("viser ikke knapp til DialogmoteUnntak når bruker ikke er Dialogmotekandidat", () => {
      renderInnkallingDialogmotePanel(brukerKanVarsles);

      expect(queryButton("Sett unntak")).to.not.exist;
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og ingen ferdigstilte referat ", () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => []
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByRole("button", { name: "Sett unntak" });
      expect(button).to.exist;
      userEvent.click(button);
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et ferdigstilt referat som er opprettet tidligere enn tidspunkt for Kandidat", () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      const createdAt = dayjs(new Date(dialogmotekandidatMock.kandidatAt))
        .subtract(1, "days")
        .toISOString();
      const dialogmote = createDialogmote(
        "1",
        DialogmoteStatus.FERDIGSTILT,
        MotedeltakerVarselType.REFERAT,
        createdAt
      );
      const dialogmoteFerdigstiltTidligereEnnKandidat = {
        ...dialogmote,
        referatList: [createReferat(true, createdAt)],
      };
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoteFerdigstiltTidligereEnnKandidat]
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByText("Sett unntak");
      expect(button).to.exist;
      userEvent.click(button);
    });
    it("viser ikke knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et ferdigstilt referat som er opprettet etter tidspunkt for Kandidat", () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      const createdAt = dayjs(new Date(dialogmotekandidatMock.kandidatAt))
        .add(1, "days")
        .toISOString();
      const dialogmote = createDialogmote(
        "1",
        DialogmoteStatus.FERDIGSTILT,
        MotedeltakerVarselType.REFERAT,
        createdAt
      );
      const dialogmoteFerdigstiltEtterKandidat = {
        ...dialogmote,
        referatList: [createReferat(true, createdAt)],
      };
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoteFerdigstiltEtterKandidat]
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = queryButton("Sett unntak");
      expect(button).to.not.exist;
    });
    it("viser knapp til DialogmoteUnntak når bruker er Dialogmotekandidat og det er et mellomlagret referat som er opprettet etter tidspunkt for Kandidat", () => {
      queryClient.setQueryData(
        dialogmotekandidatQueryKeys.kandidat(ARBEIDSTAKER_DEFAULT.personIdent),
        () => dialogmotekandidatMock
      );
      const createdAt = dayjs(new Date(dialogmotekandidatMock.kandidatAt))
        .add(1, "days")
        .toISOString();
      const dialogmote = createDialogmote(
        "1",
        DialogmoteStatus.FERDIGSTILT,
        MotedeltakerVarselType.REFERAT,
        createdAt
      );

      const dialogmoteMellomlagreReferatEtterKandidat = {
        ...dialogmote,
        referatList: [createMellomlagretReferat(createdAt)],
      };
      queryClient.setQueryData(
        dialogmoterQueryKeys.dialogmoter(ARBEIDSTAKER_DEFAULT.personIdent),
        () => [dialogmoteMellomlagreReferatEtterKandidat]
      );

      renderInnkallingDialogmotePanel(brukerKanVarsles);

      const button = screen.getByText("Sett unntak");
      expect(button).to.exist;
      userEvent.click(button);
    });
  });
});
