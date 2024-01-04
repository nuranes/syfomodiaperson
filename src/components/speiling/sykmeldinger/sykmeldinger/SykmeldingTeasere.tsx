import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingTeaser from "./SykmeldingTeaser";

interface SykmeldingTeasereProps {
  sykmeldinger: SykmeldingOldFormat[];
  className: string;
  tittel: string;
  ingenSykmeldingerMelding: string;
  id: string;
  children?: ReactElement;
}

const SykmeldingTeasere = ({
  sykmeldinger,
  className,
  tittel = "",
  ingenSykmeldingerMelding,
  id,
  children,
}: SykmeldingTeasereProps): ReactElement => {
  return (
    <div className="blokk--l">
      <header className="inngangspanelerHeader">
        <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
        {children}
      </header>
      <div id={id} className={className || "js-content"}>
        {sykmeldinger.length ? (
          sykmeldinger.map((sykmelding, idx) => (
            <SykmeldingTeaser key={idx} sykmelding={sykmelding} />
          ))
        ) : (
          <p className="typo-infotekst">{ingenSykmeldingerMelding}</p>
        )}
      </div>
    </div>
  );
};

export default SykmeldingTeasere;
