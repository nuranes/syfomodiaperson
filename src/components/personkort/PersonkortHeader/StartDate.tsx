import styled from "styled-components";
import { useStartOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import React from "react";

const texts = {
  startDate: "Sykmeldt f.o.m.: ",
};

const StartDateWrapper = styled.div`
  font-weight: normal;
`;

const Date = styled.span`
  font-weight: bold;
`;

export const StartDate = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  return (
    <>
      {!!startDate && (
        <StartDateWrapper>
          <span>{texts.startDate}</span>
          <Date>{tilLesbarDatoMedArUtenManedNavn(startDate)}</Date>
        </StartDateWrapper>
      )}
    </>
  );
};
