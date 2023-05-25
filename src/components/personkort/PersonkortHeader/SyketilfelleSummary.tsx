import React from "react";
import styled from "styled-components";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Varighet } from "@/components/personkort/PersonkortHeader/Varighet";

export const StyledInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75em;
  align-items: center;
`;

export const SyketilfelleInfoWrapper = styled.div`
  font-weight: normal;
`;

export const SyketilfelleInfoElement = styled.span`
  font-weight: bold;
`;

export const SyketilfelleSummary = () => {
  return (
    <StyledInfo>
      <TilfellePeriod />
      <Varighet />
      <Diagnosekode />
    </StyledInfo>
  );
};
