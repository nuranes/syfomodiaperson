import React, { ReactElement } from "react";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

const OppsummeringBekreftelsespunkter = ({
  sporsmalstekst,
  id,
  svar,
  overskriftsnivaa,
  undersporsmal,
}: OppsummeringSporsmalProps): ReactElement => (
  <div className="oppsummering__VisUndertekst" id={id}>
    <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
      {sporsmalstekst}
    </OppsummeringSporsmalstekst>
    <ul>
      {svar.map((s, index) => (
        <li
          key={index}
          className="redaksjonelt-innhold"
          dangerouslySetInnerHTML={{ __html: (s.verdi as string) ?? "" }}
        />
      ))}
    </ul>
    <OppsummeringUndersporsmalsliste
      sporsmalsliste={undersporsmal}
      overskriftsnivaa={overskriftsnivaa}
    />
  </div>
);

export default OppsummeringBekreftelsespunkter;
