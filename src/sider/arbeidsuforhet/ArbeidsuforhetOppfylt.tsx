import React, { ReactElement } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { OppfyltForm } from "@/sider/arbeidsuforhet/OppfyltForm";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { Navigate } from "react-router-dom";

export const ArbeidsuforhetOppfylt = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;

  return isForhandsvarsel ? (
    <OppfyltForm />
  ) : (
    <Navigate to={arbeidsuforhetPath} />
  );
};
