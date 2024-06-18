import {
  dialogmoteMedVarsel,
  narmesteLederNavn,
  varselArbeidsgiver,
} from "../testData";
import { render, screen } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { DeltakereSvarInfo } from "@/sider/dialogmoter/components/DeltakereSvarInfo";
import {
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { queryClientWithMockData } from "../../testQueryClient";

let queryClient: any;

const ingenDetaljerTekst = "Ingen detaljer er tilgjengelig.";

const renderDeltakereSvarInfo = (dialogmote: DialogmoteDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <DeltakereSvarInfo dialogmote={dialogmote} />
    </QueryClientProvider>
  );

describe("DeltakereSvarInfo for arbeidsgiver", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("arbeidsgiver har åpnet innkalling (ikke svart)", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381"
        ),
      ],
      []
    );

    it("viser nærmeste leder har åpnet innkalling med minus-sirkel-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, åpnet innkallingen 01.12.2021 - Har ikke gitt svar`;
      renderDeltakereSvarInfo(dialogmoteMedLestInnkalling);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });

  describe("arbeidsgiver har åpnet innkalling og svart KOMMER uten begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381",
          {
            svarTidspunkt: "2021-12-01T12:56:26.271381",
            svarType: SvarType.KOMMER,
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, kommer - Svar mottatt 01.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedLestInnkalling);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet innkalling og svart NYTT_TID_STED med begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381",
          {
            svarType: SvarType.NYTT_TID_STED,
            svarTidspunkt: "2021-12-01T12:56:26.271381",
            svarTekst: "Passer ikke",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å endre tid/sted med advarsel-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å endre tidspunkt eller sted - Svar mottatt 01.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedLestInnkalling);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText("Passer ikke")).to.exist;
      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet innkalling og svart KOMMER_IKKE med begrunnelse", () => {
    const dialogmoteMedLestInnkalling = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.INNKALT,
          "2021-12-01T12:56:26.271381",
          {
            svarType: SvarType.KOMMER_IKKE,
            svarTekst: "Kommer ikke",
            svarTidspunkt: "2021-12-01T12:56:26.271381",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å avlyse - Svar mottatt 01.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedLestInnkalling);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText("Kommer ikke")).to.exist;
      expect(screen.getByRole("img", { name: "feil-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har ikke åpnet innkalling", () => {
    const dialogmoteMedUlestInnkalling = dialogmoteMedVarsel(
      [varselArbeidsgiver(MotedeltakerVarselType.INNKALT)],
      []
    );

    it("viser nærmeste leder har ikke åpnet innkalling med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, har ikke åpnet innkallingen`;
      renderDeltakereSvarInfo(dialogmoteMedUlestInnkalling);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
      expect(screen.queryByText("Har ikke gitt svar", { exact: false })).to.not
        .exist;
    });
  });

  describe("arbeidsgiver har åpnet endring (ikke svart)", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381"
        ),
      ],
      []
    );

    it("viser nærmeste leder har åpnet endring med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, åpnet endringen 03.12.2021 - Har ikke gitt svar`;
      renderDeltakereSvarInfo(dialogmoteMedLestEndring);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });

  describe("arbeidsgiver har åpnet endring og svart KOMMER uten begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381",
          {
            svarType: SvarType.KOMMER,
            svarTidspunkt: "2021-12-03T12:56:26.271381",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, kommer - Svar mottatt 03.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedLestEndring);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getByRole("img", { name: "suksess-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet endring og svart NYTT_TID_STED med begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381",
          {
            svarType: SvarType.NYTT_TID_STED,
            svarTidspunkt: "2021-12-03T12:56:26.271381",
            svarTekst: "Kan vi endre sted?",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å endre tid/sted med advarsel-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å endre tidspunkt eller sted - Svar mottatt 03.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedLestEndring);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText("Kan vi endre sted?")).to.exist;
      expect(screen.getByRole("img", { name: "advarsel-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har åpnet endring og svart KOMMER IKKE med begrunnelse", () => {
    const dialogmoteMedLestEndring = dialogmoteMedVarsel(
      [
        varselArbeidsgiver(
          MotedeltakerVarselType.NYTT_TID_STED,
          "2021-12-03T12:56:26.271381",
          {
            svarType: SvarType.KOMMER_IKKE,
            svarTidspunkt: "2021-12-03T12:56:26.271381",
            svarTekst: "Jeg kommer ikke",
          }
        ),
      ],
      []
    );

    it("viser nærmeste leder ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, ønsker å avlyse - Svar mottatt 03.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedLestEndring);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.getByText("Begrunnelse")).to.exist;
      expect(screen.getByText("Jeg kommer ikke")).to.exist;
      expect(screen.getByRole("img", { name: "feil-ikon" })).to.exist;
    });
  });

  describe("arbeidsgiver har ikke åpnet endring", () => {
    const dialogmoteMedUlestEndring = dialogmoteMedVarsel(
      [varselArbeidsgiver(MotedeltakerVarselType.NYTT_TID_STED)],
      []
    );

    it("viser nærmeste leder har ikke åpnet endring med minus-sirkel-ikon og manglende begrunnelse", () => {
      const expectedText = `${narmesteLederNavn}, har ikke åpnet endringen`;
      renderDeltakereSvarInfo(dialogmoteMedUlestEndring);

      expect(screen.getByText("Nærmeste leder:")).to.exist;
      expect(screen.getByText(expectedText)).to.exist;
      expect(screen.queryByText("Har ikke gitt svar", { exact: false })).to.not
        .exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.not.be.empty;
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
      expect(screen.getAllByRole("img", { name: "minus-sirkel-ikon" })).to.not
        .be.empty;
    });
  });
});
