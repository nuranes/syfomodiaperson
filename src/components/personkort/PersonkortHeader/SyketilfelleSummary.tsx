import React from "react";
import styled from "styled-components";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";

const StyledInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SyketilfelleSummary = () => {
  return (
    <StyledInfo>
      <TilfellePeriod />
      <Diagnosekode />
    </StyledInfo>
  );
};
