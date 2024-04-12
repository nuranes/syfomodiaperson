import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { screen } from "@testing-library/react";
import { ValgtEnhetContext } from "@/context/ValgtEnhetContext";
import { expect } from "chai";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import { ArbeidsuforhetAvslag } from "@/sider/arbeidsuforhet/avslag/ArbeidsuforhetAvslag";
import { ARBEIDSTAKER_DEFAULT } from "../../../mock/common/mockConstants";
import { navEnhet } from "../../dialogmote/testData";
import { queryClientWithMockData } from "../../testQueryClient";
import {
  createForhandsvarsel,
  createVurdering,
} from "../arbeidsuforhetTestData";
import { renderWithRouter } from "../../testRouterUtils";
import { arbeidsuforhetAvslagPath } from "@/routers/AppRouter";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderArbeidsuforhetAvslagSide = () => {
  renderWithRouter(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <ArbeidsuforhetAvslag />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>,
    arbeidsuforhetAvslagPath,
    [arbeidsuforhetAvslagPath]
  );
};

describe("AvslagSide", () => {
  beforeEach(() => {
    queryClient = queryClientWithMockData();
  });

  describe("Show correct info", () => {
    it("show form if latest arbeidsuforhet status is forhandsvarsel and frist is utgatt", () => {
      const forhandsvarselAfterFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), -3),
      });
      const vurderinger = [forhandsvarselAfterFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetAvslagSide();

      expect(screen.getByText("Her kommer det et skjema!")).to.exist;
    });

    it("redirect to arbeidsuforhet page if latest arbeidsuforhet status is forhandsvarsel and frist is not utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetAvslagSide();

      expect(screen.queryByText("Her kommer det et skjema!")).to.not.exist;
    });

    it("redirect to arbeidsuforhet page if latest arbeidsuforhet status is Avslag", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetAvslagSide();

      expect(screen.queryByText("Her kommer det et skjema!")).to.not.exist;
    });

    it("redirect to arbeidsuforhet page if latest arbeidsuforhet status is Oppfylt", () => {
      const oppfylt = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [oppfylt];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetAvslagSide();

      expect(screen.queryByText("Her kommer det et skjema!")).to.not.exist;
    });
  });
});
