import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { Maksdato } from "@/data/maksdato/useMaksdatoQuery";
import { SyketilfelleSummaryElement } from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

const texts = {
  maksdato: "Maksdato: ",
  utbetaltTom: "Utbetalt tom: ",
};

interface MaksdatoSummaryProps {
  maxDate: Maksdato;
}
export const MaksdatoSummary = ({ maxDate }: MaksdatoSummaryProps) => {
  return (
    <div className={"flex flex-row gap-3 items-center"}>
      <SyketilfelleSummaryElement
        keyword={texts.maksdato}
        value={tilLesbarDatoMedArUtenManedNavn(
          maxDate.forelopig_beregnet_slutt
        )}
      />
      <SyketilfelleSummaryElement
        keyword={texts.utbetaltTom}
        value={tilLesbarDatoMedArUtenManedNavn(maxDate.utbetalt_tom)}
      />
    </div>
  );
};
