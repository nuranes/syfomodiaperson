import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { Maksdato } from "@/data/maksdato/useMaksdatoQuery";

const texts = {
  maksdato: "Maksdato: ",
  utbetaltTom: "Utbetalt tom: ",
};

interface DatoInfoElementProps {
  tekst: string;
  dato: Date;
}

const DatoInfoElement = ({ tekst, dato }: DatoInfoElementProps) => {
  return (
    <div className={"font-normal"}>
      <span>{tekst}</span>
      <div className={"font-bold"}>{tilLesbarDatoMedArUtenManedNavn(dato)}</div>
    </div>
  );
};

interface MaksdatoSummaryProps {
  maxDate: Maksdato;
}
export const MaksdatoSummary = ({ maxDate }: MaksdatoSummaryProps) => {
  return (
    <div className={"flex flex-row gap-3 items-center"}>
      <DatoInfoElement
        tekst={texts.maksdato}
        dato={maxDate.forelopig_beregnet_slutt}
      />
      <DatoInfoElement tekst={texts.utbetaltTom} dato={maxDate.utbetalt_tom} />
    </div>
  );
};
