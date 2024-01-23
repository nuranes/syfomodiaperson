import React, { ReactElement } from "react";
import OppsummeringSporsmal from "./OppsummeringSporsmal";
import { getKey } from "./Oppsummeringsvisning";
import { SporsmalDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

interface OppsummeringUndersporsmalslisteProps {
  sporsmalsliste: SporsmalDTO[];
  overskriftsnivaa?: number;
}

const OppsummeringUndersporsmalsliste = ({
  sporsmalsliste = [],
  overskriftsnivaa = 4,
}: OppsummeringUndersporsmalslisteProps): ReactElement | null =>
  sporsmalsliste.length > 0 ? (
    <div className="oppsummering__undersporsmalsliste">
      {sporsmalsliste.map((sporsmal) => (
        <OppsummeringSporsmal
          {...sporsmal}
          key={getKey(sporsmal.tag, sporsmal.id)}
          overskriftsnivaa={overskriftsnivaa}
        />
      ))}
    </div>
  ) : null;

export default OppsummeringUndersporsmalsliste;
