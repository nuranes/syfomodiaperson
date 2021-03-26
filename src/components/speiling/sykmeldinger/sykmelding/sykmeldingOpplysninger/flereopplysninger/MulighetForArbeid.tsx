import React from "react";
import { SykmeldingOldFormat } from "../../../../../../data/sykmelding/types/SykmeldingOldFormat";
import {
  getSykmeldingCheckbox,
  getSykmeldingOpplysning,
} from "../../../../../../utils/sykmeldingUtils";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import { SykmeldingCheckbox } from "../SykmeldingCheckbox";

const texts = {
  mulighetForArbeid: "Mulighet for arbeid",
  medisinskAarsak:
    "Det er medisinske årsaker som hindrer arbeidsrelatert aktivitet",
  arsak: "Angi hva som er årsaken",
  arbeidsplassForhold:
    "Forhold på arbeidsplassen vanskeliggjør arbeidsrelatert aktivitet",
  erIkkeIArbeid: "Pasienten kan ikke være i arbeid (100&nbsp;% sykmeldt)",
  medisinskAarsakBeskriv: "Beskriv nærmere",
};

const fjernAnnet = (array: string[]): string[] => {
  if (array.length === 1 && array.indexOf("Annet") > -1) {
    return [];
  }
  return array;
};

interface AarsakerProps {
  aarsaker: string[];
  containerClassName: string;
}

const Aarsaker = (aarsakerProps: AarsakerProps) => {
  const { aarsaker, containerClassName } = aarsakerProps;
  return (
    <div className={containerClassName}>
      {fjernAnnet(aarsaker).map((aarsak: string, key: number) => {
        return (
          <SykmeldingCheckbox
            tekst={aarsak}
            key={key}
            className="subopplysning"
          />
        );
      })}
    </div>
  );
};

interface MulighetForArbeidProps {
  sykmelding: SykmeldingOldFormat;
}

const MulighetForArbeid = (mulighetForArbeidProps: MulighetForArbeidProps) => {
  const { sykmelding } = mulighetForArbeidProps;
  const visSeksjon =
    (sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length) ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 ||
    (sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length) ||
    sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">{texts.mulighetForArbeid}</h4>
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0 ? (
        <SykmeldingOpplysning tittel={texts.erIkkeIArbeid}>
          <div>
            {getSykmeldingCheckbox(
              sykmelding.mulighetForArbeid,
              "aktivitetIkkeMulig433",
              texts.medisinskAarsak
            )}
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig433}
              containerClassName="js-aktivitetIkkeMulig433hvisJa"
            />
          </div>
        </SykmeldingOpplysning>
      ) : null}
      {(() => {
        return getSykmeldingOpplysning(
          sykmelding.mulighetForArbeid,
          "aarsakAktivitetIkkeMulig433",
          texts.medisinskAarsakBeskriv
        );
      })()}
      {sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length > 0 ? (
        <SykmeldingOpplysning tittel={texts.erIkkeIArbeid}>
          <div>
            {getSykmeldingCheckbox(
              sykmelding.mulighetForArbeid,
              "aktivitetIkkeMulig434",
              texts.arbeidsplassForhold
            )}
            <Aarsaker
              aarsaker={sykmelding.mulighetForArbeid.aktivitetIkkeMulig434}
              containerClassName="js-aktivitetIkkeMulig434hvisJa"
            />
          </div>
        </SykmeldingOpplysning>
      ) : null}
      {getSykmeldingOpplysning(
        sykmelding.mulighetForArbeid,
        "aarsakAktivitetIkkeMulig434",
        texts.arsak
      )}
    </div>
  );
};

export default MulighetForArbeid;
