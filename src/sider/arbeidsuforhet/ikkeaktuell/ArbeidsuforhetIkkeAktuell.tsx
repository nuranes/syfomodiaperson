import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { Navigate } from "react-router-dom";
import { ArbeidsuforhetIkkeAktuellSkjema } from "@/sider/arbeidsuforhet/ikkeaktuell/ArbeidsuforhetIkkeAktuellSkjema";

export const ArbeidsuforhetIkkeAktuell = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const isForhandsvarsel = data[0]?.type === VurderingType.FORHANDSVARSEL;

  return isForhandsvarsel ? (
    <ArbeidsuforhetIkkeAktuellSkjema />
  ) : (
    <Navigate to={arbeidsuforhetPath} />
  );
};
