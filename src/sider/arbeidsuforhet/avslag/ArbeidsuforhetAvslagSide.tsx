import React, { ReactElement } from "react";
import { ArbeidsuforhetAvslag } from "@/sider/arbeidsuforhet/avslag/ArbeidsuforhetAvslag";
import { ArbeidsuforhetSide } from "@/sider/arbeidsuforhet/ArbeidsuforhetSide";

export const ArbeidsuforhetAvslagSide = (): ReactElement => (
  <ArbeidsuforhetSide>
    <ArbeidsuforhetAvslag />
  </ArbeidsuforhetSide>
);
