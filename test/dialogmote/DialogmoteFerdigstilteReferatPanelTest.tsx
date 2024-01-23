import { render, screen } from "@testing-library/react";
import { DialogmoteFerdigstilteReferatPanel } from "@/sider/mote/components/DialogmoteFerdigstilteReferatPanel";
import React from "react";
import {
  createFerdigstiltReferat,
  createMellomlagretReferat,
  dialogmote,
  dialogmoteMedFerdigstiltReferat,
} from "./testData";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { daysFromToday, getButton } from "../testUtils";
import { MemoryRouter } from "react-router-dom";
import { expect } from "chai";
import {
  tilDatoMedManedNavnOgKlokkeslett,
  tilLesbarDatoMedArstall,
} from "@/utils/datoUtils";
import dayjs from "dayjs";

const today = new Date();
const yesterday = daysFromToday(-1);
const fristText = "Siste frist for å sende ut en endring av dette referatet er";
const endreReferatRoute = "/referat/endre";
const ferdigstiltDialogmoteYesterday: DialogmoteDTO = {
  ...dialogmoteMedFerdigstiltReferat,
  status: DialogmoteStatus.FERDIGSTILT,
  tid: yesterday.toISOString(),
};
const ferdigstiltDialogmote29DaysAgo: DialogmoteDTO = {
  ...dialogmoteMedFerdigstiltReferat,
  status: DialogmoteStatus.FERDIGSTILT,
  tid: daysFromToday(-29).toISOString(),
};
const ferdigstiltDialogmote30DaysAgo: DialogmoteDTO = {
  ...dialogmoteMedFerdigstiltReferat,
  status: DialogmoteStatus.FERDIGSTILT,
  tid: daysFromToday(-30).toISOString(),
};
const ferdigstiltDialogmoteTwoMonthsAgo: DialogmoteDTO = {
  ...dialogmoteMedFerdigstiltReferat,
  status: DialogmoteStatus.FERDIGSTILT,
  tid: daysFromToday(-60).toISOString(),
};

const renderDialogmoteFerdigstilteReferatPanel = (
  ferdigstilteMoter: DialogmoteDTO[]
) =>
  render(
    <MemoryRouter>
      <DialogmoteFerdigstilteReferatPanel
        ferdigstilteMoter={ferdigstilteMoter}
      />
    </MemoryRouter>
  );

describe("DialogmoteFerdigstilteReferatPanel", () => {
  it("viser ingenting når ingen ferdigstilte møter kan endre referat", () => {
    const ferdigstilteMoter = [
      ferdigstiltDialogmote30DaysAgo,
      ferdigstiltDialogmoteTwoMonthsAgo,
    ];
    renderDialogmoteFerdigstilteReferatPanel(ferdigstilteMoter);

    expect(
      screen.queryByRole("heading", {
        name: "Referatet er sendt",
      })
    ).to.not.exist;
  });
  it("kan endre referat for møter inntil 30 dager etter møtetidspunkt", () => {
    const ferdigstilteMoter = [
      ferdigstiltDialogmoteYesterday,
      ferdigstiltDialogmote29DaysAgo,
      ferdigstiltDialogmote30DaysAgo,
      ferdigstiltDialogmoteTwoMonthsAgo,
    ];
    renderDialogmoteFerdigstilteReferatPanel(ferdigstilteMoter);

    const expectedAntallMoter = 2;
    expect(
      screen.getAllByRole("heading", {
        name: "Referatet er sendt",
      })
    ).to.have.length(expectedAntallMoter);
  });
  it("viser liste med ferdigstilte referater for møte som kan endre referat", () => {
    const ferdigstiltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.FERDIGSTILT,
      tid: yesterday.toISOString(),
      referatList: [
        createFerdigstiltReferat(today.toISOString()),
        createFerdigstiltReferat(yesterday.toISOString()),
        createMellomlagretReferat(),
      ],
    };
    renderDialogmoteFerdigstilteReferatPanel([ferdigstiltDialogmote]);

    const referater = screen.getAllByRole("listitem");
    expect(referater).to.have.length(2);
    expect(referater[0].textContent).to.equal(
      `Endret referat, sendt ${tilLesbarDatoMedArstall(today)}`
    );
    expect(referater[1].textContent).to.equal(
      `Referat, sendt ${tilLesbarDatoMedArstall(yesterday)}`
    );
  });
  it("viser frist for å endre referat", () => {
    const ferdigstiltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.FERDIGSTILT,
      tid: yesterday.toISOString(),
      referatList: [createFerdigstiltReferat(yesterday.toISOString())],
    };
    renderDialogmoteFerdigstilteReferatPanel([ferdigstiltDialogmote]);

    const expectedFrist = dayjs(yesterday).add(30, "days");
    expect(
      screen.getByText(
        `${fristText} ${tilDatoMedManedNavnOgKlokkeslett(expectedFrist)}`
      )
    );
  });
  it("viser knapp for å endre referat", () => {
    const ferdigstiltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.FERDIGSTILT,
      tid: yesterday.toISOString(),
      referatList: [createFerdigstiltReferat(yesterday.toISOString())],
    };
    renderDialogmoteFerdigstilteReferatPanel([ferdigstiltDialogmote]);

    const endreButton = getButton("Endre referatet");
    expect(endreButton).to.exist;
    expect(endreButton.getAttribute("href")).to.contain(endreReferatRoute);
  });
  it("viser knapp for å fullføre endring på referat dersom siste referat for møte ikke er ferdigstilt", () => {
    const ferdigstiltDialogmote: DialogmoteDTO = {
      ...dialogmote,
      status: DialogmoteStatus.FERDIGSTILT,
      tid: yesterday.toISOString(),
      referatList: [
        createMellomlagretReferat(),
        createFerdigstiltReferat(yesterday.toISOString()),
      ],
    };
    renderDialogmoteFerdigstilteReferatPanel([ferdigstiltDialogmote]);

    const fullforButton = getButton("Fullfør endringen");
    expect(fullforButton).to.exist;
    expect(fullforButton.getAttribute("href")).to.contain(endreReferatRoute);
  });
});
