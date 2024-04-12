import React, { ReactElement } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Navigate } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";

const texts = {
  placeholder: "Her kommer det et skjema!",
};

export const ArbeidsuforhetAvslag = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarselExpired = sisteVurdering.varsel?.isExpired;

  return !isForhandsvarselExpired ? (
    <Navigate to={arbeidsuforhetPath} />
  ) : (
    <p>{texts.placeholder}</p>
  );
};
