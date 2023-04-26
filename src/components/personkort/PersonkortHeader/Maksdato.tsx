import { useMaksdatoQuery } from "@/data/maksdato/useMaksdatoQuery";
import React from "react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import {
  SyketilfelleInfoElement,
  SyketilfelleInfoWrapper,
} from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

const texts = {
  maksdato: "Maksdato: ",
};

export const Maksdato = () => {
  const { data } = useMaksdatoQuery();

  return (
    <>
      {data?.maxDate && (
        <SyketilfelleInfoWrapper>
          <span>{texts.maksdato}</span>
          <SyketilfelleInfoElement>
            {tilLesbarDatoMedArUtenManedNavn(data.maxDate)}
          </SyketilfelleInfoElement>
        </SyketilfelleInfoWrapper>
      )}
    </>
  );
};
