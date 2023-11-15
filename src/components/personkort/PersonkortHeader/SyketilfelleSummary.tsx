import React from "react";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Varighet } from "@/components/personkort/PersonkortHeader/Varighet";
import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import { MaksdatoSummary } from "@/components/personkort/PersonkortHeader/MaksdatoSummary";

interface SyketilfelleSummaryElementProps {
  keyword: string;
  value: string;
}

export const SyketilfelleSummaryElement = ({
  keyword,
  value,
}: SyketilfelleSummaryElementProps) => {
  return (
    <div className={"font-normal"}>
      <span>{keyword}</span>
      <b>{value}</b>
    </div>
  );
};

export const SyketilfelleSummary = () => {
  const { data: maksDato } = useMaksdatoQuery();
  return (
    <>
      <div className={"flex flex-row gap-3 items-center"}>
        <TilfellePeriod />
        <Varighet />
        <Diagnosekode />
      </div>
      {maksDato?.maxDate && <MaksdatoSummary maxDate={maksDato.maxDate} />}
    </>
  );
};
