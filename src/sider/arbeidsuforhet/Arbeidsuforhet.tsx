import React, { ReactElement, useState } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { NyVurdering } from "@/sider/arbeidsuforhet/NyVurdering";
import { StartetVurdering } from "@/sider/arbeidsuforhet/StartetVurdering";

export const Arbeidsuforhet = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const [showStartetVurdering, setShowStartetVurdering] =
    useState<boolean>(false);

  return showStartetVurdering || isForhandsvarsel ? (
    <StartetVurdering />
  ) : (
    <NyVurdering handleClick={() => setShowStartetVurdering(true)} />
  );
};
