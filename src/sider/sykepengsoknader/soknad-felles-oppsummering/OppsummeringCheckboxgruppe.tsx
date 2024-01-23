import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringSporsmal, {
  OppsummeringSporsmalProps,
} from "./OppsummeringSporsmal";
import { getKey } from "./Oppsummeringsvisning";

const OppsummeringCheckboxgruppe = ({
  tag,
  sporsmalstekst,
  undersporsmal,
  overskriftsnivaa,
}: OppsummeringSporsmalProps): ReactElement => (
  <OppsummeringSporsmalscontainer tag={tag}>
    <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
      {sporsmalstekst}
    </OppsummeringSporsmalstekst>
    {undersporsmal.map((s) => (
      <OppsummeringSporsmal
        {...s}
        overskriftsnivaa={overskriftsnivaa && overskriftsnivaa + 1}
        key={getKey(s.tag, s.id)}
      />
    ))}
  </OppsummeringSporsmalscontainer>
);

export default OppsummeringCheckboxgruppe;
