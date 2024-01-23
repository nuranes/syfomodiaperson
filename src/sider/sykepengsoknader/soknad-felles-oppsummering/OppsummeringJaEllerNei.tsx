import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringAvkrysset from "./OppsummeringAvkrysset";
import OppsummeringUndersporsmalsliste from "./OppsummeringUndersporsmalsliste";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import {
  SvarDTO,
  VisningskriterieDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  ja: "Ja",
  nei: "Nei",
};

const getLedetekstFraSvar = (svar: string) => {
  return svar.toLowerCase() === "ja" ? texts.ja : texts.nei;
};

const erUndersporsmalStilt = (
  svar: SvarDTO[],
  kriterieForVisningAvUndersporsmal?: VisningskriterieDTO
) => svar.some((s) => s.verdi === kriterieForVisningAvUndersporsmal);

const OppsummeringJaEllerNei = ({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa = 3,
  kriterieForVisningAvUndersporsmal,
  undersporsmal,
}: OppsummeringSporsmalProps): ReactElement | null => {
  if (svar[0] === undefined) {
    return null;
  }
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <OppsummeringAvkrysset
        tekst={getLedetekstFraSvar(svar[0].verdi as string)}
      />
      {erUndersporsmalStilt(svar, kriterieForVisningAvUndersporsmal) && (
        <OppsummeringUndersporsmalsliste
          sporsmalsliste={undersporsmal}
          overskriftsnivaa={overskriftsnivaa + 1}
        />
      )}
    </OppsummeringSporsmalscontainer>
  );
};

export default OppsummeringJaEllerNei;
