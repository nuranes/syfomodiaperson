import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";

const texts = {
  startDate: "Sykmeldt: ",
};

export const TilfellePeriod = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  return !!startDate && !!endDate ? (
    <div className={"font-normal"}>
      <span>{texts.startDate}</span>
      <div className={"font-bold"}>{`${tilLesbarDatoMedArUtenManedNavn(
        startDate
      )} - ${tilLesbarDatoMedArUtenManedNavn(endDate)}`}</div>
    </div>
  ) : null;
};
