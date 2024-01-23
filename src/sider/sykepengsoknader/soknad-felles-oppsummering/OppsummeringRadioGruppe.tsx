import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import OppsummeringAvkrysset from "./OppsummeringAvkrysset";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import {
  SvarTypeDTO,
  VisningskriterieDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const OppsummeringRadiogruppe = ({
  sporsmalstekst,
  tag,
  overskriftsnivaa,
  undersporsmal,
  id,
  svartype,
}: OppsummeringSporsmalProps): ReactElement | null => {
  const besvartUndersporsmal = undersporsmal.find((s) => {
    return s.svar.length > 0 && s.svar[0].verdi === VisningskriterieDTO.CHECKED;
  });
  return besvartUndersporsmal ? (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      {svartype === SvarTypeDTO.RADIO_GRUPPE && (
        <OppsummeringAvkrysset
          id={id}
          tekst={besvartUndersporsmal.sporsmalstekst}
        />
      )}
      <OppsummeringUndersporsmalsliste
        sporsmalsliste={besvartUndersporsmal.undersporsmal}
        overskriftsnivaa={overskriftsnivaa && overskriftsnivaa + 1}
      />
    </OppsummeringSporsmalscontainer>
  ) : null;
};

export default OppsummeringRadiogruppe;
