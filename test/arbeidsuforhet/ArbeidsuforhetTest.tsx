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
import { clickButton } from "../testUtils";

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
    const nyVurderingButtonText = "Start ny vurdering";

    describe("Show ny vurdering button", () => {
      it("if there are no vurderinger", () => {
        const vurderinger = [];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();

        expect(screen.getByText("Siste vurdering")).to.exist;
        expect(screen.getByRole("button", { name: nyVurderingButtonText })).to
          .exist;
      });

      it("if latest arbeidsuforhet status is oppfylt", () => {
        const oppfyltVurdering = createVurdering({
          type: VurderingType.OPPFYLT,
          begrunnelse: "begrunnelse",
          createdAt: new Date(),
        });
        const vurderinger = [oppfyltVurdering];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();

        expect(screen.getByText("Siste vurdering")).to.exist;
        expect(screen.getByRole("button", { name: nyVurderingButtonText })).to
          .exist;
      });

      it("if status is avslag", () => {
        const avslag = createVurdering({
          type: VurderingType.AVSLAG,
          begrunnelse: "",
          createdAt: new Date(),
        });
        const vurderinger = [avslag];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();

        expect(screen.getByText("Siste vurdering")).to.exist;
        expect(screen.getByText("Start ny vurdering")).to.exist;
      });
    });

    describe("Show send forhandsvarsel form", () => {
      const assertOnlyFormIsShowing = () => {
        expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
          .not.exist;
        expect(screen.getByText("Send forhåndsvarsel")).to.exist;
        expect(screen.getByRole("button", { name: "Send" })).to.exist;
        expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
        expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      };

      it("after clicking ny vurdering if no there are no existing vurderinger", () => {
        const vurderinger = [];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();
        clickButton(nyVurderingButtonText);

        assertOnlyFormIsShowing();
      });

      it("after clicking ny vurdering if latest arbeidsuforhet status is oppfylt", () => {
        const oppfyltVurdering = createVurdering({
          type: VurderingType.OPPFYLT,
          begrunnelse: "begrunnelse",
          createdAt: new Date(),
        });
        const vurderinger = [oppfyltVurdering];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();
        clickButton(nyVurderingButtonText);

        assertOnlyFormIsShowing();
      });

      it("after clicking ny vurdering if latest arbeidsuforhet status is avslag", () => {
        const oppfyltVurdering = createVurdering({
          type: VurderingType.AVSLAG,
          begrunnelse: "",
          createdAt: new Date(),
        });
        const vurderinger = [oppfyltVurdering];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();
        clickButton(nyVurderingButtonText);

        assertOnlyFormIsShowing();
      });
    });

    describe("Show sent forhandsvarsel page", () => {
      it("if status is forhandsvarsel and frist is not utgatt", () => {
        const forhandsvarselBeforeFrist = createForhandsvarsel({
          createdAt: new Date(),
          svarfrist: addWeeks(new Date(), 3),
        });
        const vurderinger = [forhandsvarselBeforeFrist];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();

        expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
          .not.exist;
        expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
        expect(screen.getByText("Venter på svar fra bruker")).to.exist;
        expect(screen.queryByText("Fristen er gått ut")).to.not.exist;
      });

      it("show sent forhandsvarsel page if status is forhandsvarsel and frist is utgatt", () => {
        const forhandsvarselBeforeFrist = createForhandsvarsel({
          createdAt: new Date(),
          svarfrist: addWeeks(new Date(), -3),
        });
        const vurderinger = [forhandsvarselBeforeFrist];
        mockArbeidsuforhetVurderinger(vurderinger);

        renderArbeidsuforhetSide();

        expect(screen.queryByRole("button", { name: nyVurderingButtonText })).to
          .not.exist;
        expect(screen.queryByText("Send forhåndsvarsel")).to.not.exist;
        expect(screen.queryByText("Venter på svar fra bruker")).to.not.exist;
        expect(screen.getByText("Fristen er gått ut")).to.exist;
      });
    });
  });
});
