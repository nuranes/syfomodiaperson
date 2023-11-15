import React from "react";
import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getEarliestDate, getWeeksBetween } from "@/utils/datoUtils";
import { SyketilfelleSummaryElement } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

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
    <SyketilfelleSummaryElement
      keyword={texts.varighet}
      value={`${weeks} ${texts.uker}`}
    />
  ) : null;
};
