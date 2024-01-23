import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";

const texts = {
  title: "Melding til arbeidsgiver",
  content: "Andre innspill til arbeidsgiver",
};

interface MeldingTilArbeidsgiverProps {
  sykmelding: SykmeldingOldFormat;
}

const MeldingTilArbeidsgiver = (
  meldingTilArbeidsgiverProps: MeldingTilArbeidsgiverProps
) => {
  const { sykmelding } = meldingTilArbeidsgiverProps;
  const visSeksjon = sykmelding.innspillTilArbeidsgiver;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">{texts.title}</h4>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding}
        felt={"innspillTilArbeidsgiver"}
        tittel={texts.content}
      />
    </div>
  );
};

export default MeldingTilArbeidsgiver;
