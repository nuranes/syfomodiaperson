import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { addWeeks } from "@/utils/datoUtils";
import { ForhandsvarselBeforeDeadline } from "@/sider/arbeidsuforhet/ForhandsvarselBeforeDeadline";
import { ForhandsvarselAfterDeadline } from "@/sider/arbeidsuforhet/ForhandsvarseAfterDeadline";
import dayjs from "dayjs";

export const ForhandsvarselSendt = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const frist = addWeeks(new Date(forhandsvarsel.createdAt), 3);
  const isBeforeFrist = dayjs().isBefore(frist, "day");

  return (
    <div>
      {isBeforeFrist ? (
        <ForhandsvarselBeforeDeadline />
      ) : (
        <ForhandsvarselAfterDeadline />
      )}
    </div>
  );
};
