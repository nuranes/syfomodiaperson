import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DialogmotedeltakerBehandlerVarselSvarDTO,
  DialogmoteDTO,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import {
  behandlerDeltaker,
  dialogmote,
  dialogmoteMedBehandler,
} from "../testData";
import { render, screen } from "@testing-library/react";
import React from "react";
import { expect, describe, it, beforeEach } from "vitest";
import {
  queryClientWithMockData,
  testQueryClient,
} from "../../testQueryClient";
import { DeltakereSvarInfo } from "@/sider/dialogmoter/components/DeltakereSvarInfo";

let queryClient: QueryClient;

const dialogmoteBehandlerMedSvar = (
  svarList: Pick<
    DialogmotedeltakerBehandlerVarselSvarDTO,
    "svarType" | "tekst" | "createdAt"
  >[]
): DialogmoteDTO => ({
  ...dialogmoteMedBehandler,
  behandler: {
    ...behandlerDeltaker,
    varselList: [
      {
        varselType: MotedeltakerVarselType.INNKALT,
        fritekst: "",
        createdAt: "",
        uuid: "",
        document: [],
        svar: svarList.map((svar) => ({ uuid: "", ...svar })),
      },
    ],
  },
});

const ingenDetaljerTekst = "Ingen detaljer er tilgjengelig.";

const renderDeltakereSvarInfo = (dialogmote: DialogmoteDTO) =>
  render(
    <QueryClientProvider client={queryClient}>
      <DeltakereSvarInfo dialogmote={dialogmote} />
    </QueryClientProvider>
  );

describe("DeltakereSvarInfo uten behandler", () => {
  it("viser ikke ekspanderbart panel for svar fra behandler", () => {
    queryClient = testQueryClient();
    renderDeltakereSvarInfo(dialogmote);

    expect(screen.queryByText("Behandleren", { exact: false })).to.not.exist;
    expect(
      screen.queryByRole("button", {
        name: /Behandleren/,
      })
    ).to.not.exist;
    expect(
      screen.queryByRole("region", {
        name: /Behandleren/,
      })
    ).to.not.exist;
  });
});

describe("DeltakereSvarInfo med behandler", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });
  describe("behandler har ikke svart på innkalling", () => {
    const dialogmoteMedUbesvartVarsel = dialogmoteBehandlerMedSvar([]);

    it("viser at behandler ikke har gitt svar med minus-sirkel ikon og manglende begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, har ikke gitt svar`;
      renderDeltakereSvarInfo(dialogmoteMedUbesvartVarsel);

      expect(screen.getAllByRole("button", { name: "Vis mer" })).to.have.length(
        3
      );
      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        screen.getAllByRole("img", {
          name: "minus-sirkel-ikon",
        })
      ).to.have.length(3);
      expect(screen.getAllByText(ingenDetaljerTekst)).to.have.length(3);
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
    });
  });
  describe("behandler har svart kommer uten begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.KOMMER,
        createdAt: "2021-12-07T12:56:26.271381",
      },
    ]);

    it("viser behandler 'kommer' med suksess-ikon og manglende begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, kommer - Svar mottatt 07.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      expect(screen.getAllByRole("button", { name: "Vis mer" })).to.have.length(
        3
      );
      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        screen.getByRole("img", {
          name: "suksess-ikon",
        })
      ).to.exist;
      expect(screen.getAllByText(ingenDetaljerTekst)).to.have.length(3);
      expect(screen.queryByText("Begrunnelse")).to.not.exist;
    });
  });
  describe("behandler har svart 'kommer ikke' med begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.KOMMER_IKKE,
        tekst: "Jeg kan ikke komme",
        createdAt: "2021-12-08T12:56:26.271381",
      },
    ]);

    it("viser behandler ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å avlyse - Svar mottatt 08.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      expect(screen.getAllByRole("button", { name: "Vis mer" })).to.have.length(
        3
      );
      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        screen.getByRole("img", {
          name: "feil-ikon",
        })
      ).to.exist;
      expect(
        screen.getByText("Begrunnelse mottatt 08.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        screen.getByText("Jeg kan ikke komme", {
          exact: false,
        })
      ).to.exist;
    });
  });
  describe("behandler har svart 'nytt tid/sted' med begrunnelse etter 'kommer' med begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.NYTT_TID_STED,
        tekst: "Tidspunktet passer ikke likevel",
        createdAt: "2021-12-08T12:56:26.271381",
      },
      {
        svarType: SvarType.KOMMER,
        tekst: "Jeg kommer",
        createdAt: "2021-12-07T12:56:26.271381",
      },
    ]);

    it("viser behandler ønsker å endre tid/sted med advarsel-ikon og begrunnelser fra siste og tidligere svar", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å endre tidspunkt eller sted - Oppdatering mottatt 08.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      expect(screen.getAllByRole("button", { name: "Vis mer" })).to.have.length(
        3
      );
      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        screen.getByRole("img", {
          name: "advarsel-ikon",
        })
      ).to.exist;
      expect(
        screen.getByText("Begrunnelse mottatt 08.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        screen.getByText("Tidspunktet passer ikke likevel", {
          exact: false,
        })
      ).to.exist;
      expect(
        screen.getByText("Begrunnelse mottatt 07.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(screen.getByText("Jeg kommer", { exact: false })).to.exist;
      expect(
        screen.getAllByText(ingenDetaljerTekst, {
          exact: false,
        })
      ).to.have.length(2);
    });
  });
  describe("behandler har svart 'kommer ikke' med begrunnelse etter 'kommer' uten begrunnelse", () => {
    const dialogmoteMedSvar = dialogmoteBehandlerMedSvar([
      {
        svarType: SvarType.KOMMER_IKKE,
        tekst: "Kommer ikke likevel",
        createdAt: "2021-12-08T12:56:26.271381",
      },
      {
        svarType: SvarType.KOMMER,
        createdAt: "2021-12-07T12:56:26.271381",
      },
    ]);

    it("viser behandler ønsker å avlyse med feil-ikon og begrunnelse", () => {
      const expectedText = `${behandlerDeltaker.behandlerNavn}, ønsker å avlyse - Oppdatering mottatt 08.12.2021`;
      renderDeltakereSvarInfo(dialogmoteMedSvar);

      expect(screen.getAllByRole("button", { name: "Vis mer" })).to.have.length(
        3
      );
      expect(screen.getByText("Behandleren:", { exact: false })).to.exist;
      expect(screen.getByText(expectedText, { exact: false })).to.exist;
      expect(
        screen.getByRole("img", {
          name: "feil-ikon",
        })
      ).to.exist;
      expect(
        screen.getByText("Begrunnelse mottatt 08.12.2021", {
          exact: false,
        })
      ).to.exist;
      expect(
        screen.getByText("Kommer ikke likevel", {
          exact: false,
        })
      ).to.exist;
      expect(
        screen.getAllByText(ingenDetaljerTekst, {
          exact: false,
        })
      ).to.have.length(2);
    });
  });
});
