import { QueryClient } from "@tanstack/react-query";
import React from "react";
import { queryClientWithMockData } from "../testQueryClient";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";
import { screen } from "@testing-library/react";
import { expect, describe, it, beforeEach } from "vitest";
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
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { renderArbeidsuforhetSide } from "./arbeidsuforhetTestUtils";

let queryClient: QueryClient;

const mockArbeidsuforhetVurderinger = (vurderinger: VurderingResponseDTO[]) => {
  queryClient.setQueryData(
    arbeidsuforhetQueryKeys.arbeidsuforhet(ARBEIDSTAKER_DEFAULT.personIdent),
    () => vurderinger
  );
};

const renderArbeidsuforhetOppfyltSide = () => {
  renderArbeidsuforhetSide(
    queryClient,
    <ArbeidsuforhetOppfylt />,
    arbeidsuforhetOppfyltPath,
    [arbeidsuforhetOppfyltPath]
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
          "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen."
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
          "Skriv en kort begrunnelse for hvorfor bruker likevel oppfyller vilkårene i § 8-4, og hvilke opplysninger som ligger til grunn for vurderingen."
        )
      ).to.exist;
    });

    it("redirect arbeidsuforhet page if latest arbeidsuforhet status is Oppfylt", () => {
      const oppfylt = createVurdering({
        type: VurderingType.OPPFYLT,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [oppfylt];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetOppfyltSide();

      expect(
        screen.queryByText(
          "Skriv en kort begrunnelse for hvorfor bruker oppfyller vilkårene i § 8-4."
        )
      ).to.not.exist;
    });

    it("redirect arbeidsuforhet page if latest arbeidsuforhet status is Avslag", () => {
      const avslag = createVurdering({
        type: VurderingType.AVSLAG,
        begrunnelse: "begrunnelse",
        createdAt: new Date(),
      });
      const vurderinger = [avslag];
      mockArbeidsuforhetVurderinger(vurderinger);

      renderArbeidsuforhetOppfyltSide();

      expect(
        screen.queryByText(
          "Skriv en kort begrunnelse for hvorfor bruker oppfyller vilkårene i § 8-4."
        )
      ).to.not.exist;
    });
  });
});
