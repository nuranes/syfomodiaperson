import React, { ReactElement } from "react";
import { CheckboxPng } from "../../../../img/ImageComponents";

interface OppsummeringAvkryssetProps {
  tekst?: string;
  id?: string;
}

const OppsummeringAvkrysset = ({
  tekst,
  id,
}: OppsummeringAvkryssetProps): ReactElement => (
  <div className="oppsummering__avkrysset" id={id}>
    <img src={CheckboxPng} alt="Avkrysset" />
    <span>{tekst}</span>
  </div>
);

export default OppsummeringAvkrysset;
