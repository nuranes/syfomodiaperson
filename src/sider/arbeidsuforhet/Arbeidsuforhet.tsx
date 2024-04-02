import React, { ReactElement } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { SendForhandsvarselSkjema } from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { AvslagSent } from "@/sider/arbeidsuforhet/AvslagSent";

export const Arbeidsuforhet = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const isOppfylt = sisteVurdering?.type === VurderingType.OPPFYLT;
  const isAvslag = sisteVurdering?.type === VurderingType.AVSLAG;

  return (
    <div className="mb-2">
      {(!sisteVurdering || isOppfylt) && <SendForhandsvarselSkjema />}
      {isForhandsvarsel && <ForhandsvarselSendt />}
      {isAvslag && <AvslagSent />}
    </div>
  );
};
