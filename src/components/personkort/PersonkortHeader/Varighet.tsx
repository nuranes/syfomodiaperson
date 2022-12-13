import React from "react";
import styled from "styled-components";
import {
  useStartOfLatestOppfolgingstilfelle,
  useEndOfLatestOppfolgingstilfelle,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { getWeeksBetween, getEarliestDate } from "@/utils/datoUtils";

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
  const endDate = useEndOfLatestOppfolgingstilfelle();
  const now = new Date();
  const earliest = getEarliestDate(endDate, now);
  const weeks = getWeeksBetween(startDate, earliest);

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
