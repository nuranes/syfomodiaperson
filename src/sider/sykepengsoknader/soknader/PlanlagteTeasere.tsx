import React, { ReactElement } from "react";
import PlanlagtTeaser from "./PlanlagtTeaser";
import { SykepengesoknadDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

interface PlanlagteTeasereProps {
  sykepengesoknader: SykepengesoknadDTO[];
  tittel?: string;
}

const PlanlagteTeasere = ({
  sykepengesoknader,
  tittel = "",
}: PlanlagteTeasereProps): ReactElement => {
  return (
    <div className="blokk--l">
      <header className="inngangspanelerHeader">
        <h2 className="inngangspanelerHeader__tittel">{tittel}</h2>
      </header>
      <div className="js-planlagte-soknader">
        {sykepengesoknader.map((soknad, idx) => (
          <PlanlagtTeaser key={idx} soknad={soknad} />
        ))}
      </div>
    </div>
  );
};

export default PlanlagteTeasere;
