import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

const OppsummeringFritekst = ({
  sporsmalstekst,
  id,
  overskriftsnivaa,
  svar,
}: OppsummeringSporsmalProps): ReactElement => (
  <div className="oppsummering__fritekst" id={id}>
    <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
      {sporsmalstekst}
    </OppsummeringSporsmalstekst>
    {svar[0] && <p className="sist">{svar[0].verdi}</p>}
  </div>
);

export default OppsummeringFritekst;
