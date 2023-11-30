import React from "react";
import { Checkbox } from "nav-frontend-skjema";
import {
  erArbeidsforEtterPerioden,
  erEkstraDiagnoseInformasjon,
  erHensynPaaArbeidsplassenInformasjon,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import Diagnoser from "./Diagnoser";
import Perioder from "./Perioder";
import EkstraDiagnoseInformasjon from "./EkstraDiagnoseInformasjon";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";

const tekster = {
  generellSykmeldingInfo: {
    arbeidsforEtterPerioden: {
      tittel: "Pasienten er 100 % arbeidsfør etter perioden",
    },
    hensynPaaArbeidsplassen: {
      tittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen",
    },
  },
};

interface GenerellSykmeldingInfoProps {
  sykmelding: SykmeldingOldFormat;
}

export const GenerellSykmeldingInfo = ({
  sykmelding,
}: GenerellSykmeldingInfoProps) => {
  const hovedDiagnose = sykmelding.diagnose.hoveddiagnose;
  const biDiagnoser = sykmelding.diagnose.bidiagnoser
    ? sykmelding.diagnose.bidiagnoser
    : [];
  const sykmeldingPerioderSortertEtterDato =
    sykmeldingperioderSortertEldstTilNyest(
      sykmelding.mulighetForArbeid.perioder
    );
  const isEkstraDiagnoseInformasjonVisible =
    erEkstraDiagnoseInformasjon(sykmelding);
  return (
    <div className="sykmeldingMotebehovVisning__avsnitt">
      <Perioder perioder={sykmeldingPerioderSortertEtterDato} />
      <Diagnoser hovedDiagnose={hovedDiagnose} biDiagnoser={biDiagnoser} />
      {isEkstraDiagnoseInformasjonVisible && (
        <EkstraDiagnoseInformasjon diagnose={sykmelding.diagnose} />
      )}
      {erArbeidsforEtterPerioden(sykmelding) && (
        <Checkbox
          label={tekster.generellSykmeldingInfo.arbeidsforEtterPerioden.tittel}
          checked={sykmelding.friskmelding.arbeidsfoerEtterPerioden}
          disabled
        />
      )}
      {erHensynPaaArbeidsplassenInformasjon(sykmelding) && [
        <h6 key={0} className="sporsmal">
          {tekster.generellSykmeldingInfo.hensynPaaArbeidsplassen.tittel}
        </h6>,
        <p key={1}>{sykmelding.friskmelding.hensynPaaArbeidsplassen}</p>,
      ]}
    </div>
  );
};

export default GenerellSykmeldingInfo;
