import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { render, screen } from "@testing-library/react";
import React from "react";
import { DialogmoteMoteStatusPanel } from "@/sider/dialogmoter/components/innkalling/DialogmoteMoteStatusPanel";
import { dialogmote, dialogmoteMedMellomlagretReferat } from "./testData";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { expect, describe, it } from "vitest";
import { daysFromToday, getButton } from "../testUtils";
import { queryClientWithMockData } from "../testQueryClient";
import {
  ANNEN_VEILEDER,
  ANNEN_VEILEDER_IDENT,
  VEILEDER_DEFAULT,
} from "../../mock/common/mockConstants";

const queryClient = queryClientWithMockData();

const renderDialogmoteMoteStatusPanel = (dialogmote: DialogmoteDTO) =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <DialogmoteMoteStatusPanel dialogmote={dialogmote} />
      </QueryClientProvider>
    </MemoryRouter>
  );

describe("DialogmoteMoteStatusPanel", () => {
  it("Viser knapp 'Skriv referat' når dialogmøte uten påbegynt referat", () => {
    renderDialogmoteMoteStatusPanel(dialogmote);

    expect(getButton("Skriv referat")).to.exist;
    expect(screen.queryByRole("button", { name: "Fortsett på referatet" })).to
      .not.exist;
  });
  it("Viser knapp 'Fortsett på referat' når dialogmøte med påbegynt referat", () => {
    renderDialogmoteMoteStatusPanel(dialogmoteMedMellomlagretReferat);

    expect(getButton("Fortsett på referatet")).to.exist;
    expect(screen.queryByRole("button", { name: "Skriv referat" })).to.not
      .exist;
  });
  it("Viser overskrift 'Innkallingen er sendt' for innkalt dialogmøte i morgen", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: daysFromToday(1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(innkaltDialogmote);

    expect(screen.getByRole("heading", { name: "Innkallingen er sendt" })).to
      .exist;
  });
  it("Viser overskrift 'Endringen er sendt' for endret dialogmøte i morgen", () => {
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      tid: daysFromToday(1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(endretDialogmote);

    expect(screen.getByRole("heading", { name: "Endringen er sendt" })).to
      .exist;
  });
  it("Viser overskrift 'Møtedato er passert' for innkalt dialogmøte i går", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: daysFromToday(-1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(innkaltDialogmote);

    expect(screen.getByRole("heading", { name: "Møtedato er passert" })).to
      .exist;
  });
  it("Viser overskrift 'Møtedato er passert' for endret dialogmøte i går", () => {
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      tid: daysFromToday(-1).toISOString(),
    };
    renderDialogmoteMoteStatusPanel(endretDialogmote);

    expect(screen.getByRole("heading", { name: "Møtedato er passert" })).to
      .exist;
  });
  it("Viser overskrift 'Innkallingen er sendt' for innkalt dialogmøte i dag", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: new Date().toISOString(),
    };
    renderDialogmoteMoteStatusPanel(innkaltDialogmote);

    expect(screen.getByRole("heading", { name: "Innkallingen er sendt" })).to
      .exist;
  });
  it("Viser overskrift 'Endringen er sendt' for endret dialogmøte i dag", () => {
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      tid: new Date().toISOString(),
    };
    renderDialogmoteMoteStatusPanel(endretDialogmote);

    expect(screen.getByRole("heading", { name: "Endringen er sendt" })).to
      .exist;
  });
  describe("Samme veileder har innkalt og er tildelt dialogmøte", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: new Date().toISOString(),
      opprettetAv: VEILEDER_DEFAULT.ident,
      tildeltVeilederIdent: VEILEDER_DEFAULT.ident,
    };
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      opprettetAv: VEILEDER_DEFAULT.ident,
      tildeltVeilederIdent: VEILEDER_DEFAULT.ident,
    };

    it("Viser navn på veileder for innkalt dialogmøte", () => {
      renderDialogmoteMoteStatusPanel(innkaltDialogmote);

      expect(screen.getByText(`Innkalt av: ${VEILEDER_DEFAULT.fulltNavn()}`)).to
        .exist;
    });
    it("Viser navn på veileder for endret dialogmøte", () => {
      renderDialogmoteMoteStatusPanel(endretDialogmote);

      expect(screen.getByText(`Innkalt av: ${VEILEDER_DEFAULT.fulltNavn()}`)).to
        .exist;
    });
  });
  describe("Annen veileder er tildelt dialogmøte", () => {
    const innkaltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      tid: new Date().toISOString(),
      opprettetAv: VEILEDER_DEFAULT.ident,
      tildeltVeilederIdent: ANNEN_VEILEDER_IDENT,
    };
    const endretDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.NYTT_TID_STED,
      opprettetAv: VEILEDER_DEFAULT.ident,
      tildeltVeilederIdent: ANNEN_VEILEDER_IDENT,
    };

    it("Viser navn på veiledere som har innkalt og er tildelt for innkalt dialogmøte", () => {
      renderDialogmoteMoteStatusPanel(innkaltDialogmote);

      expect(
        screen.getByText(
          `Innkalt av: ${VEILEDER_DEFAULT.fulltNavn()} (Tildelt: ${ANNEN_VEILEDER.fulltNavn()})`
        )
      ).to.exist;
    });
    it("Viser navn på veiledere som har innkalt og er tildelt for endret dialogmøte", () => {
      renderDialogmoteMoteStatusPanel(endretDialogmote);

      expect(
        screen.getByText(
          `Innkalt av: ${VEILEDER_DEFAULT.fulltNavn()} (Tildelt: ${ANNEN_VEILEDER.fulltNavn()})`
        )
      ).to.exist;
    });
  });
});
