import React from "react";
import styled from "styled-components";
import { useStartOfLatestOppfolgingstilfelle } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getWeeksSinceDate } from "@/utils/datoUtils";

const texts = {
  varighet: "Varighet: ",
  uker: "uker",
};

const VarighetWrapper = styled.div`
  font-weight: normal;
  margin-left: 0.5em;
`;

const Weeks = styled.span`
  font-weight: bold;
`;

export const Varighet = () => {
  const startDate = useStartOfLatestOppfolgingstilfelle();
  const weeks = getWeeksSinceDate(startDate);

  return (
    <>
      {!!startDate && (
        <VarighetWrapper>
          <span> {texts.varighet} </span>
          <Weeks>{`${weeks} ${texts.uker}`}</Weeks>
        </VarighetWrapper>
      )}
    </>
  );
};
