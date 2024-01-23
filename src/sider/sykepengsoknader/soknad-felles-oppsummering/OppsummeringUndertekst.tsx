import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

const OppsummeringUndertekst = ({
  sporsmalstekst,
  id,
  overskriftsnivaa,
  undertekst,
  undersporsmal,
}: OppsummeringSporsmalProps): ReactElement => (
  <div className="oppsummering__VisUndertekst" id={id}>
    <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
      {sporsmalstekst}
    </OppsummeringSporsmalstekst>
    <div
      className="redaksjonelt-innhold"
      dangerouslySetInnerHTML={{ __html: undertekst ?? "" }}
    />
    <OppsummeringUndersporsmalsliste
      sporsmalsliste={undersporsmal}
      overskriftsnivaa={overskriftsnivaa}
    />
  </div>
);

export default OppsummeringUndertekst;
