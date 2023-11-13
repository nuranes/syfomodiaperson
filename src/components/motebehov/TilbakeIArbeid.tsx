import React from "react";
import TilbakeIArbeidMedArbeidsgiver from "./TilbakeIArbeidMedArbeidsgiver";
import TilbakeIArbeidUtenArbeidsgiver from "./TilbakeIArbeidUtenArbeidsgiver";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

interface TilbakeIArbeidProps {
  sykmelding: SykmeldingOldFormat;
}

export const TilbakeIArbeid = ({ sykmelding }: TilbakeIArbeidProps) => {
  const friskmelding = sykmelding.friskmelding;
  return (
    <div className="sykmeldingMotebehovVisning__avsnitt">
      <TilbakeIArbeidMedArbeidsgiver friskmelding={friskmelding} />
      <TilbakeIArbeidUtenArbeidsgiver friskmelding={friskmelding} />
    </div>
  );
};

export default TilbakeIArbeid;
