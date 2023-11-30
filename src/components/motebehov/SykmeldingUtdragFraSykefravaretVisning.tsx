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
  erMeldingTilArbeidsgiverInformasjon,
  erMeldingTilNavInformasjon,
  erUtdypendeOpplysninger,
} from "@/utils/sykmeldinger/sykmeldingUtils";

interface SykmeldingMotebehovVisningProps {
  sykmelding: SykmeldingOldFormat;
}

const SykmeldingUtdragFraSykefravaretVisning = ({
  sykmelding,
}: SykmeldingMotebehovVisningProps) => {
  const isMeldingTilArbeidsgiverVisible =
    erMeldingTilArbeidsgiverInformasjon(sykmelding);
  const isMeldingTilNavVisible = erMeldingTilNavInformasjon(sykmelding);
  const isUtdypendeOpplysningerVisible =
    sykmelding && erUtdypendeOpplysninger(sykmelding);

  return (
    <div className="sykmeldingMotebehovVisning">
      <GenerellSykmeldingInfo sykmelding={sykmelding} />
      <MulighetForArbeid sykmelding={sykmelding} />
      {erFriskmeldingInformasjon(sykmelding) && (
        <TilbakeIArbeid sykmelding={sykmelding} />
      )}
      {isUtdypendeOpplysningerVisible && (
        <UtdypendeOpplysninger
          utdypendeOpplysninger={sykmelding.utdypendeOpplysninger}
        />
      )}
      {erBedringAvArbeidsevnenInformasjon(sykmelding) && (
        <BedreArbeidsevnen sykmelding={sykmelding} />
      )}
      {isMeldingTilNavVisible && (
        <MeldingTilNav meldingTilNav={sykmelding.meldingTilNav} />
      )}
      {isMeldingTilArbeidsgiverVisible && (
        <MeldingTilArbeidsgiver
          innspillTilArbeidsgiver={sykmelding.innspillTilArbeidsgiver}
        />
      )}
    </div>
  );
};

export default SykmeldingUtdragFraSykefravaretVisning;
