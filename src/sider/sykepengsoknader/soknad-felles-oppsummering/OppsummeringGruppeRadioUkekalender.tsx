import React, { ReactElement } from "react";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import OppsummeringSporsmalscontainer from "./OppsummeringSporsmalscontainer";
import OppsummeringSporsmalstekst from "./OppsummeringSporsmalstekst";
import OppsummeringAvkrysset from "./OppsummeringAvkrysset";
import { OppsummeringSporsmalProps } from "./OppsummeringSporsmal";

const OppsummeringGruppeRadioUkekalender = ({
  tag,
  svar,
  sporsmalstekst,
  overskriftsnivaa,
  id,
}: OppsummeringSporsmalProps): ReactElement => {
  const oppsummertSvar =
    svar[0] && svar[0].verdi !== "Ikke til behandling"
      ? toDatePrettyPrint(svar[0].verdi)
      : "Ikke til behandling";
  return (
    <OppsummeringSporsmalscontainer tag={tag}>
      <OppsummeringSporsmalstekst overskriftsnivaa={overskriftsnivaa}>
        {sporsmalstekst}
      </OppsummeringSporsmalstekst>
      <OppsummeringAvkrysset id={id} tekst={oppsummertSvar} />
    </OppsummeringSporsmalscontainer>
  );
};

export default OppsummeringGruppeRadioUkekalender;
