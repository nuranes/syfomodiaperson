import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { ForhandsvarselBeforeDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import { ForhandsvarselAfterDeadline } from "@/sider/arbeidsuforhet/ForhandsvarseAfterDeadline";

export const ForhandsvarselSendt = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const isForhandsvarselExpired = forhandsvarsel.varsel?.isExpired;

  return (
    <div>
      {isForhandsvarselExpired ? (
        <ForhandsvarselAfterDeadline />
      ) : (
        <ForhandsvarselBeforeDeadline />
      )}
    </div>
  );
};
