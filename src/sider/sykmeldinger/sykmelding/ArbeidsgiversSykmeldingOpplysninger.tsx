import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import ArbeidsgiversNokkelopplysninger from "./ArbeidsgiversNokkelopplysninger";
import FlereOpplysninger from "./sykmeldingOpplysninger/flereopplysninger/FlereOpplysninger";

interface ArbeidsgiversSykmeldingOpplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

const ArbeidsgiversSykmeldingOpplysninger = (
  arbeidsgiversSykmeldingOpplysningerProps: ArbeidsgiversSykmeldingOpplysningerProps
) => {
  const { sykmelding } = arbeidsgiversSykmeldingOpplysningerProps;
  return (
    <div className="side-innhold arbeidsgiversSykmelding">
      <header className="arbeidsgiversSykmelding__header">
        <h3 className="arbeidsgiversSykmelding__tittel">
          {sykmelding.pasient.fornavn} {sykmelding.pasient.mellomnavn}{" "}
          {sykmelding.pasient.etternavn}
        </h3>
        <p className="js-fnr arbeidsgiversSykmelding__fodselsnummer">
          {sykmelding.pasient.fnr}
        </p>
      </header>
      <ArbeidsgiversNokkelopplysninger sykmelding={sykmelding} />
      <FlereOpplysninger sykmelding={sykmelding} />
    </div>
  );
};

export default ArbeidsgiversSykmeldingOpplysninger;
