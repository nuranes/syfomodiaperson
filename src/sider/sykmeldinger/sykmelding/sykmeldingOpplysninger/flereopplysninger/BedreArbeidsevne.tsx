import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";

const texts = {
  arbeidsevne: "Hva skal til for å bedre arbeidsevnen?",
  tilrettelegging: "Tilrettelegging/hensyn som bør tas på arbeidsplassen",
  tiltakNAV: "Tiltak i regi av NAV",
  tiltakAndre: "Eventuelle andre innspill til NAV",
};

interface BedreArbeidsevneProps {
  sykmelding: SykmeldingOldFormat;
}

const BedreArbeidsevne = (bedreArbeidsevneProps: BedreArbeidsevneProps) => {
  const { sykmelding } = bedreArbeidsevneProps;
  const visSeksjon =
    sykmelding.arbeidsevne.tilretteleggingArbeidsplass ||
    sykmelding.arbeidsevne.tiltakNAV ||
    sykmelding.arbeidsevne.tiltakAndre;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">{texts.arbeidsevne}</h4>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.arbeidsevne}
        felt={"tilretteleggingArbeidsplass"}
        tittel={texts.tilrettelegging}
      />
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.arbeidsevne}
        felt={"tiltakNAV"}
        tittel={texts.tiltakNAV}
      />
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.arbeidsevne}
        felt={"tiltakAndre"}
        tittel={texts.tiltakAndre}
      />
    </div>
  );
};

export default BedreArbeidsevne;
