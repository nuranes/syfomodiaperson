import React, { ReactElement } from "react";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import { getKey } from "./Oppsummeringsvisning";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";
import {
  SvarDTO,
  SvarTypeDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  timerTotalt: "timer totalt",
  prosent: "prosent",
};

const verdiAdjustedIfBelop = (
  svar: SvarDTO,
  svartype?: SvarTypeDTO
): string => {
  if (svartype == SvarTypeDTO.BELOP) {
    return (Number(svar.verdi) / 100).toString();
  }
  return svar.verdi as string;
};

const getSvartypeText = (svartype: SvarTypeDTO | undefined): string => {
  switch (svartype) {
    case SvarTypeDTO.TIMER:
      return texts.timerTotalt;
    case SvarTypeDTO.PROSENT:
      return texts.prosent;
    default:
      return "";
  }
};

const OppsummeringTall = ({
  svar,
  sporsmalstekst,
  tag,
  overskriftsnivaa,
  svartype,
}: OppsummeringSporsmalProps): ReactElement => {
  const text = getSvartypeText(svartype);
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <div className="oppsummering__tekstsvar">
        {svar.map((svarverdi, index) => {
          const verdi = verdiAdjustedIfBelop(svarverdi, svartype);
          return (
            <p className="oppsummering__tekst" key={getKey(tag, index)}>
              {verdi} {text}
            </p>
          );
        })}
      </div>
    </OppsummeringSporsmalscontainer>
  );
};

export default OppsummeringTall;
