import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { screen } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect, describe, it, beforeEach } from "vitest";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { VurderingResponseDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { createForhandsvarsel } from "./arbeidsuforhetTestData";
import { renderWithRouter } from "../testRouterUtils";
import { arbeidsuforhetPath } from "@/routers/AppRouter";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderForhandsvarselSendt = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <ForhandsvarselSendt />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    arbeidsuforhetPath,
    [arbeidsuforhetPath]
  );
};

describe("ForhandsvarselSendt", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Show correct component", () => {
    it("show ForhandsvarselBeforeDeadline when svarfrist is in three weeks (not expired)", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSendt();

      expect(
        screen.getByText(
          `Forhåndsvarselet er sendt ${tilLesbarDatoMedArUtenManedNavn(
            new Date()
          )}.`
        )
      ).to.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.getByText("Fristen går ut:")).to.exist;
      expect(
        screen.getByText(
          "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-4, klikker du på Oppfylt-knappen. Du kan ikke avslå før fristen er gått ut."
        )
      ).to.exist;
      expect(screen.getByRole("img", { name: "klokkeikon" })).to.exist;
      expect(
        screen.getByRole("button", { name: "Innstilling om avslag" })
      ).to.have.property("disabled", true);
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
    });

    it("show ForhandsvarselAfterDeadline when svarfrist is today (expired)", () => {
      const createdAt = addWeeks(new Date(), -3);
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: createdAt,
        svarfrist: new Date(),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderForhandsvarselSendt();

      expect(screen.getByText("Fristen er gått ut")).to.exist;
      expect(screen.getByText(tilLesbarDatoMedArUtenManedNavn(new Date()))).to
        .exist;
      expect(screen.getByRole("img", { name: "bjelleikon" })).to.exist;
      expect(
        screen.getByText(
          `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
            createdAt
          )} er gått ut. Trykk på Innstilling om avslag-knappen hvis vilkårene i § 8-4 ikke er oppfylt og rett til videre sykepenger skal avslås.`
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Innstilling om avslag" })).to
        .exist;
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
    });
  });
});
