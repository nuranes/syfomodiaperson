import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  StyledInfo,
  SyketilfelleInfoElement,
  SyketilfelleInfoWrapper,
} from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

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

export const MaksdatoSummary = () => {
  const { data } = useMaksdatoQuery();

  return (
    <>
      {data?.maxDate && (
        <StyledInfo>
          <DatoInfoElement
            tekst={texts.maksdato}
            dato={data.maxDate.forelopig_beregnet_slutt}
          />
          <DatoInfoElement
            tekst={texts.utbetaltTom}
            dato={data.maxDate.utbetalt_tom}
          />
        </StyledInfo>
      )}
    </>
  );
};
