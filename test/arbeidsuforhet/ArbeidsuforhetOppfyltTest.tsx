import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { render, screen } from "@testing-library/react";
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
import { ArbeidsuforhetOppfylt } from "@/sider/arbeidsuforhet/ArbeidsuforhetOppfylt";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderArbeidsuforhetOppfyltSide = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <ValgtEnhetContext.Provider
        value={{ valgtEnhet: navEnhet.id, setValgtEnhet: () => void 0 }}
      >
        <ArbeidsuforhetOppfylt />
      </ValgtEnhetContext.Provider>
    </QueryClientProvider>
  );
};

describe("OppfyltSide", () => {
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

      renderArbeidsuforhetOppfyltSide();

      expect(
        screen.getByText(
          "Skriv en kort begrunnelse for hvorfor bruker oppfyller § 8-4"
        )
      ).to.exist;
    });

    it("show form if latest arbeidsuforhet status is forhandsvarsel and frist is not utgatt", () => {
      const forhandsvarselBeforeFrist = createForhandsvarsel({
        createdAt: new Date(),
        svarfrist: addWeeks(new Date(), 3),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetOppfyltSide();

      expect(
        screen.getByText(
          "Skriv en kort begrunnelse for hvorfor bruker oppfyller § 8-4"
        )
      ).to.exist;
    });

    it("show succes if latest arbeidsuforhet status is Oppfylt", () => {
      const forhandsvarselBeforeFrist = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetOppfyltSide();

      expect(
        screen.getByText(
          "Begrunnelsen din på at bruker oppfyller § 8-4 er lagret i historikken."
        )
      ).to.exist;
    });

    it("show error if latest arbeidsuforhet status is Avslag", () => {
      const forhandsvarselBeforeFrist = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [forhandsvarselBeforeFrist];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetOppfyltSide();

      expect(
        screen.getByText(
          "Trykk på 'Forhåndsvarsel'-menypunktet for å komme til skjema for forhåndsvarsel!"
        )
      ).to.exist;
    });
  });
});
