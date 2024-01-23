import React from "react";
import SykmeldingPeriode from "./SykmeldingPeriode";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { getDuration } from "@/utils/datoUtils";
import { sorterPerioderEldsteForst } from "@/utils/periodeUtils";

interface SykmeldingPerioderProps {
  perioder: SykmeldingPeriodeDTO[];
}
const SykmeldingPerioder = (
  sykmeldingPerioderProps: SykmeldingPerioderProps
) => {
  const { perioder = [] } = sykmeldingPerioderProps;
  return (
    <div
      className={`sykmeldingPerioder ${
        perioder.length > 1 ? "sykmeldingPerioder--flere" : ""
      }`}
    >
      {sorterPerioderEldsteForst(perioder).map((periode, index) => {
        return (
          <SykmeldingPeriode
            key={index}
            periode={periode}
            antallDager={getDuration(periode.fom, periode.tom)}
          />
        );
      })}
    </div>
  );
};

export default SykmeldingPerioder;
