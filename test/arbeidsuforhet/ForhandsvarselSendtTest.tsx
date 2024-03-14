import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import { NotificationContext } from "@/context/notification/NotificationContext";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { VurderingResponseDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks, tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { createForhandsvarsel } from "./arbeidsuforhetTestData";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderForhandsvarselSendt = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <NotificationContext.Provider
          value={{ notification: undefined, setNotification: () => void 0 }}
        >
          <ForhandsvarselSendt />
        </NotificationContext.Provider>
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
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
          "Om du får svar fra bruker, og hen oppfyller kravene om 8-4 etter din vurdering, klikker du på “oppfylt”-knappen under. Om ikke må du vente til tiden går ut før du kan gi avslag."
        )
      ).to.exist;
      expect(screen.getByRole("img", { name: "klokkeikon" })).to.exist;
      expect(screen.getByRole("button", { name: "Avslag" })).to.have.property(
        "disabled",
        true
      );
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Se hele brevet" })).to.exist;
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

      expect(
        screen.getByText(
          `Forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
            createdAt
          )} er gått ut!`
        )
      ).to.exist;
      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
      expect(screen.getByText("Fristen er utgått!")).to.exist;
      expect(screen.getByRole("img", { name: "bjelleikon" })).to.exist;
      expect(
        screen.getByText(
          "Tiden har gått ut og du kan nå gå videre med å sende avslag."
        )
      ).to.exist;
      expect(screen.getByRole("button", { name: "Avslag" })).to.have.property(
        "disabled",
        false
      );
      expect(screen.getByRole("button", { name: "Oppfylt" })).to.exist;
      expect(screen.getByRole("button", { name: "Se hele brevet" })).to.exist;
    });
  });
});
