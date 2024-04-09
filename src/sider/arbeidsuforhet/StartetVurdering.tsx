import React from "react";
import { SendForhandsvarselSkjema } from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

export const StartetVurdering = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;

  return isForhandsvarsel ? (
    <ForhandsvarselSendt />
  ) : (
    <SendForhandsvarselSkjema />
  );
};
