import React from "react";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Varighet } from "@/components/personkort/PersonkortHeader/Varighet";

export const SyketilfelleSummary = () => {
  return (
    <div className={"flex flex-row gap-3 items-center"}>
      <TilfellePeriod />
      <Varighet />
      <Diagnosekode />
    </div>
  );
};
