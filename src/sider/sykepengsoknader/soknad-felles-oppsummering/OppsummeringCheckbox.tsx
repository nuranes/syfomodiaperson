import React, { ReactElement } from "react";
import OppsummeringAvkrysset from "./OppsummeringAvkrysset";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import { VisningskriterieDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const OppsummeringCheckbox = ({
  svar,
  sporsmalstekst,
  undersporsmal,
  overskriftsnivaa = 3,
}: OppsummeringSporsmalProps): ReactElement | null =>
  svar[0] && svar[0].verdi === VisningskriterieDTO.CHECKED ? (
    <div>
      <OppsummeringAvkrysset tekst={sporsmalstekst} />
      <OppsummeringUndersporsmalsliste
        sporsmalsliste={undersporsmal}
        overskriftsnivaa={overskriftsnivaa}
      />
    </div>
  ) : null;

export default OppsummeringCheckbox;
