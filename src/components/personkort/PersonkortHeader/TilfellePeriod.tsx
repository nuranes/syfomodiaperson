import styled from "styled-components";
import {
  useEndOfLatestOppfolgingstilfelle,
  useStartOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";

const texts = {
  startDate: "Sykmeldt: ",
};

const TilfelleWrapper = styled.div`
  font-weight: normal;
`;

const Dates = styled.span`
  font-weight: bold;
`;

export const TilfellePeriod = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const endDate = useEndOfLatestOppfolgingstilfelle();
  return (
    <>
      {!!startDate && !!endDate && (
        <TilfelleWrapper>
          <span>{texts.startDate}</span>
          <Dates>{`${tilLesbarDatoMedArUtenManedNavn(
            startDate
          )} - ${tilLesbarDatoMedArUtenManedNavn(endDate)}`}</Dates>
        </TilfelleWrapper>
      )}
    </>
  );
};
