import React from "react";
import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getEarliestDate, getWeeksBetween } from "@/utils/datoUtils";

const texts = {
  varighet: "Varighet: ",
  uker: "uker",
};

export const Varighet = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  const now = new Date();
  const earliest = getEarliestDate(endDate, now);
  const weeks = getWeeksBetween(startDate, earliest);

  return !!startDate ? (
    <div className={"font-normal"}>
      <span> {texts.varighet} </span>
      <div className={"font-bold"}>{`${weeks} ${texts.uker}`}</div>
    </div>
  ) : null;
};
