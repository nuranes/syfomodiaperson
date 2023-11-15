import React from "react";

const tekster = {
  meldingTilArbeidsgiver: {
    header: "Melding til arbeidsgiver",
    innspillTittel: "Andre innspill til arbeidsgiver",
  },
};

interface MeldingTilArbeidsgiverProps {
  innspillTilArbeidsgiver?: string;
}

export const MeldingTilArbeidsgiver = ({
  innspillTilArbeidsgiver,
}: MeldingTilArbeidsgiverProps) => {
  return (
    <div className="sykmeldingMotebehovVisning__avsnitt">
      <h5 className="undertittel">{tekster.meldingTilArbeidsgiver.header}</h5>
      <h6 className="sporsmal">
        {tekster.meldingTilArbeidsgiver.innspillTittel}
      </h6>
      <p>{innspillTilArbeidsgiver}</p>
    </div>
  );
};

export default MeldingTilArbeidsgiver;
