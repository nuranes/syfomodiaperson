import React, { ReactElement } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Navigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { AvslagForm } from "@/sider/arbeidsuforhet/avslag/AvslagForm";

export const ArbeidsuforhetAvslag = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarselExpired = sisteVurdering.varsel?.isExpired;

  return !isForhandsvarselExpired ? (
    <Navigate to={arbeidsuforhetPath} />
  ) : (
    <AvslagForm />
  );
};
