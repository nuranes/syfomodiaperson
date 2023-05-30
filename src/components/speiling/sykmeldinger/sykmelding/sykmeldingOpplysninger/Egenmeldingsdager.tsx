import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import React from "react";
import SykmeldingNokkelOpplysning from "@/components/speiling/sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import dayjs from "dayjs";

const texts = {
  title: "Egenmeldingsdager (lagt til av deg)",
  daySingle: "dag",
  dayMultiple: "dager",
};

interface EgenmeldingsdagerSummaryProps {
  egenmeldingsdager: string[];
}

const asDateAscending = (dateA: string, dateB: string) =>
  dayjs(dateA).isAfter(dayjs(dateB)) ? 1 : -1;

const EgenmeldingsdagerSummary = ({
  egenmeldingsdager,
}: EgenmeldingsdagerSummaryProps) => {
  const antallDager = egenmeldingsdager.length;
  const dayText = antallDager === 1 ? texts.daySingle : texts.dayMultiple;
  return (
    <>
      {egenmeldingsdager.sort(asDateAscending).map((dag, index) => (
        <p key={index}>{tilLesbarDatoMedArstall(dag)}</p>
      ))}
      <p>{`(${antallDager} ${dayText})`}</p>
    </>
  );
};

interface EgenmeldingsdagerProps {
  sykmelding: SykmeldingOldFormat;
}

export const Egenmeldingsdager = ({ sykmelding }: EgenmeldingsdagerProps) => {
  return sykmelding.sporsmal.egenmeldingsdager &&
    sykmelding.sporsmal.egenmeldingsdager.length > 0 ? (
    <SykmeldingNokkelOpplysning tittel={texts.title}>
      <EgenmeldingsdagerSummary
        egenmeldingsdager={sykmelding.sporsmal.egenmeldingsdager}
      />
    </SykmeldingNokkelOpplysning>
  ) : (
    <></>
  );
};
