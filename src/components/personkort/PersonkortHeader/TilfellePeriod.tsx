import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";
import {
  SyketilfelleInfoElement,
  SyketilfelleInfoWrapper,
} from "@/components/personkort/PersonkortHeader/SyketilfelleSummary";

const texts = {
  startDate: "Sykmeldt: ",
};

export const TilfellePeriod = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  return (
    <>
      {!!startDate && !!endDate && (
        <SyketilfelleInfoWrapper>
          <span>{texts.startDate}</span>
          <SyketilfelleInfoElement>{`${tilLesbarDatoMedArUtenManedNavn(
            startDate
          )} - ${tilLesbarDatoMedArUtenManedNavn(
            endDate
          )}`}</SyketilfelleInfoElement>
        </SyketilfelleInfoWrapper>
      )}
    </>
  );
};
