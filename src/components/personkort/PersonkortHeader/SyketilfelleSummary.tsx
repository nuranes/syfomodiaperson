import React from "react";
import styled from "styled-components";
import { Diagnosekode } from "@/components/personkort/PersonkortHeader/Diagnosekode";
import { TilfellePeriod } from "@/components/personkort/PersonkortHeader/TilfellePeriod";
import { Varighet } from "@/components/personkort/PersonkortHeader/Varighet";

const StyledInfo = styled.div`
  display: flex;
  flex-direction: row;
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
