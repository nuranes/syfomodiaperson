import React, { ReactElement } from "react";
import { getKey } from "./Oppsummeringsvisning";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

const textFomTom = (fom?: string, tom?: string) => {
  return `Fra ${fom} til ${tom}`;
};

const OppsummeringPerioder = ({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa,
}: OppsummeringSporsmalProps): ReactElement => (
  <OppsummeringSporsmalscontainer tag={tag}>
    <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
      {sporsmalstekst}
    </OppsummeringSporsmalstekst>
    <div className="oppsummering__tekstsvar">
      {svar.map((p, i) => {
        const periode = JSON.parse(p.verdi.toString());
        return (
          <p key={getKey(tag, i)} className="oppsummering__dato">
            {textFomTom(
              toDatePrettyPrint(periode.fom),
              toDatePrettyPrint(periode.tom)
            )}
          </p>
        );
      })}
    </div>
  </OppsummeringSporsmalscontainer>
);

export default OppsummeringPerioder;
