import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { screen } from "@testing-library/react";
import { navEnhet } from "../dialogmote/testData";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import {
  createForhandsvarsel,
  createVurdering,
} from "./arbeidsuforhetTestData";
import { Arbeidsuforhet } from "@/sider/arbeidsuforhet/Arbeidsuforhet";
import { renderWithRouter } from "../testRouterUtils";
import { arbeidsuforhetPath } from "@/routers/AppRouter";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderArbeidsuforhetSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <Arbeidsuforhet />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    arbeidsuforhetPath,
    [arbeidsuforhetPath]
  );
};

describe("ArbeidsuforhetSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Show correct info", () => {
    it("show forhandsvarsel form if no there are no existing vurderinger", () => {
      const vurderinger = [];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
    });

    it("show forhandsvarsel form if latest arbeidsuforhet status is oppfylt", () => {
      const oppfyltVurdering = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [oppfyltVurdering];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Send forhåndsvarsel")).to.exist;
      expect(screen.getByRole("button", { name: "Send" })).to.exist;
    });

    it("show sent forhandsvarsel page if status is forhandsvarsel and frist is not utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Venter på svar fra bruker")).to.exist;
    });

    it("show sent forhandsvarsel page if status is forhandsvarsel and frist is utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), -3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Fristen er gått ut")).to.exist;
    });

    it("show avslag page if status is avslag", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetSide();

      expect(screen.getByText("Husk å opprette oppgave i Gosys")).to.exist;
    });
  });
});
