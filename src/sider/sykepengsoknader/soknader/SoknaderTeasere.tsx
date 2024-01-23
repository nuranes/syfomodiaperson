import React, { ReactElement } from "react";
import SoknadTeaser from "./SoknadTeaser";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

interface SoknaderTeasereProps {
  sykepengesoknader: SykepengesoknadDTO[];
  id: string;
  tomListeTekst: string;
  tittel?: string;
  className?: string;
}

const SoknaderTeasere = ({
  sykepengesoknader,
  className,
  tittel = "",
  tomListeTekst,
  id,
}: SoknaderTeasereProps): ReactElement => (
  <div className="blokk--l">
    <header className="inngangspanelerHeader">
      <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
    </header>
    <div id={id} className={className || "js-content"}>
      {sykepengesoknader.length > 0 ? (
        sykepengesoknader.map((soknad, idx) => (
          <SoknadTeaser key={idx} soknad={soknad} />
        ))
      ) : (
        <p className="panel typo-infotekst">{tomListeTekst}</p>
      )}
    </div>
  </div>
);

export default SoknaderTeasere;
