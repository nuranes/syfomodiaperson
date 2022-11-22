import React from "react";
import styled from "styled-components";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { StartDate } from "@/components/personkort/PersonkortHeader/StartDate";

const StyledInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SyketilfelleSummary = () => {
  return (
    <StyledInfo>
      <StartDate />
      <Diagnosekode />
    </StyledInfo>
  );
};
