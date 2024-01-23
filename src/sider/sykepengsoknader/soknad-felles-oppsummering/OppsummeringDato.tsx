import React, { ReactElement } from "react";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { getKey } from "./Oppsummeringsvisning";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

const OppsummeringDato = ({
  tag,
  sporsmalstekst,
  svar,
  overskriftsnivaa = 3,
}: OppsummeringSporsmalProps): ReactElement => (
  <OppsummeringSporsmalscontainer tag={tag}>
    <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
      {sporsmalstekst}
    </OppsummeringSporsmalstekst>
    <div className="oppsummering__tekstsvar">
      {svar.map((svarverdi, index) => {
        return (
          <p className="oppsummering__dato" key={getKey(tag, index)}>
            {toDatePrettyPrint(svarverdi.verdi)}
          </p>
        );
      })}
    </div>
  </OppsummeringSporsmalscontainer>
);

export default OppsummeringDato;
