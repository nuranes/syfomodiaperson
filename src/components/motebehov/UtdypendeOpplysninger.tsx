import React from "react";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";

const tekster = {
  UtdypendeOpplysninger: {
    header: "Utdypende opplysninger ved 8 uker",
  },
};

interface OpplysningsGruppeProps {
  opplysningGruppe: Map<string, SporsmalSvarDTO>;
}

const OpplysningsGruppe = ({ opplysningGruppe }: OpplysningsGruppeProps) => {
  const sporsmal = Object.entries(opplysningGruppe).map(
    ([key, sporsmalSvar]) => (
      <div key={key}>
        <h6 className="sporsmal">{sporsmalSvar.sporsmal}</h6>
        <p>{sporsmalSvar.svar}</p>
      </div>
    )
  );
  return <div>{sporsmal}</div>;
};

interface UtdypendeOpplysningerProps {
  utdypendeOpplysninger: Map<string, Map<string, SporsmalSvarDTO>>;
}

export const UtdypendeOpplysninger = ({
  utdypendeOpplysninger,
}: UtdypendeOpplysningerProps) => {
  return (
    <div className="sykmeldingMotebehovVisning__avsnitt">
      <h5 className="undertittel">{tekster.UtdypendeOpplysninger.header}</h5>

      {Object.entries(utdypendeOpplysninger).map(([key, opplysningGruppe]) => (
        <OpplysningsGruppe key={key} opplysningGruppe={opplysningGruppe} />
      ))}
    </div>
  );
};

export default UtdypendeOpplysninger;
