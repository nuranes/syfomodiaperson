import React from "react";
import {
  useStartOfLatestOppfolgingstilfelle,
  useEndOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getWeeksBetween, getEarliestDate } from "@/utils/datoUtils";
import {
  SyketilfelleInfoElement,
  SyketilfelleInfoWrapper,
} from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

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

  return (
    <>
      {!!startDate && (
        <SyketilfelleInfoWrapper>
          <span> {texts.varighet} </span>
          <SyketilfelleInfoElement>{`${weeks} ${texts.uker}`}</SyketilfelleInfoElement>
        </SyketilfelleInfoWrapper>
      )}
    </>
  );
};
