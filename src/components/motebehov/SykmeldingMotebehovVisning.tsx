import React from "react";
import MeldingTilArbeidsgiver from "./MeldingTilArbeidsgiver";
import MeldingTilNav from "./MeldingTilNav";
import BedreArbeidsevnen from "./BedreArbeidsevnen";
import UtdypendeOpplysninger from "./UtdypendeOpplysninger";
import TilbakeIArbeid from "./TilbakeIArbeid";
import GenerellSykmeldingInfo from "./GenerellSykmeldingInfo";
import MulighetForArbeid from "./MulighetForArbeid";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import {
  erBedringAvArbeidsevnenInformasjon,
  erFriskmeldingInformasjon,
} from "@/utils/sykmeldinger/sykmeldingUtils";

interface SykmeldingMotebehovVisningProps {
  sykmelding: SykmeldingOldFormat;
}

const SykmeldingMotebehovVisning = ({
  sykmelding,
}: SykmeldingMotebehovVisningProps) => (
  <div className="sykmeldingMotebehovVisning">
    <GenerellSykmeldingInfo sykmelding={sykmelding} />
    <MulighetForArbeid sykmelding={sykmelding} />
    {erFriskmeldingInformasjon(sykmelding) && (
      <TilbakeIArbeid sykmelding={sykmelding} />
    )}
    <UtdypendeOpplysninger sykmelding={sykmelding} />
    {erBedringAvArbeidsevnenInformasjon(sykmelding) && (
      <BedreArbeidsevnen sykmelding={sykmelding} />
    )}
    <MeldingTilNav sykmelding={sykmelding} />
    <MeldingTilArbeidsgiver sykmelding={sykmelding} />
  </div>
);

export default SykmeldingMotebehovVisning;
