import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  StyledInfo,
  SyketilfelleInfoElement,
  SyketilfelleInfoWrapper,
} from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";
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
    <SyketilfelleInfoWrapper>
      <span>{tekst}</span>
      <SyketilfelleInfoElement>
        {tilLesbarDatoMedArUtenManedNavn(dato)}
      </SyketilfelleInfoElement>
    </SyketilfelleInfoWrapper>
  );
};

interface MaksdatoSummaryProps {
  maxDate: Maksdato;
}
export const MaksdatoSummary = ({ maxDate }: MaksdatoSummaryProps) => {
  return (
    <StyledInfo>
      <DatoInfoElement
        tekst={texts.maksdato}
        dato={maxDate.forelopig_beregnet_slutt}
      />
      <DatoInfoElement tekst={texts.utbetaltTom} dato={maxDate.utbetalt_tom} />
    </StyledInfo>
  );
};
