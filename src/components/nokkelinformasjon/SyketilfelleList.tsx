import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import styled from "styled-components";

const texts = {
  title: "Siste sykefravær",
};

const Header = styled.h3`
  margin-bottom: 0;
`;

const List = styled.ul`
  margin-top: 0;
`;

export const SyketilfelleList = () => {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const tenLatestTilfeller = tilfellerDescendingStart?.slice(0, 10);

  return (
    <div>
      <Header>{texts.title}</Header>
      <List>
        {tenLatestTilfeller.map(
          (tilfelle: OppfolgingstilfelleDTO, index: number) => {
            return (
              <li key={index}>
                {tilLesbarPeriodeMedArUtenManednavn(
                  tilfelle.start,
                  tilfelle.end
                )}
              </li>
            );
          }
        )}
      </List>
    </div>
  );
};
