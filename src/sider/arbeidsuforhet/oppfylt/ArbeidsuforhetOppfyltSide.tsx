import React, { ReactElement } from "react";
import { ArbeidsuforhetOppfylt } from "@/sider/arbeidsuforhet/oppfylt/ArbeidsuforhetOppfylt";
import { ArbeidsuforhetSide } from "@/sider/arbeidsuforhet/ArbeidsuforhetSide";

export const ArbeidsuforhetOppfyltSide = (): ReactElement => (
  <ArbeidsuforhetSide>
    <ArbeidsuforhetOppfylt />
  </ArbeidsuforhetSide>
);
