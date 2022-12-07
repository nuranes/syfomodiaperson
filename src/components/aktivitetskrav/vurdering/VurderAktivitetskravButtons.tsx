import React from "react";
import { FlexRow } from "@/components/Layout";
import Knapp from "nav-frontend-knapper";
import styled from "styled-components";

const texts = {
  avventer: "(Avventer)",
  oppfylt: "Aktivitetskravet er oppfylt",
  unntak: "Sett unntak",
};

const StyledKnapp = styled(Knapp)`
  margin-right: 1em;
`;

export const VurderAktivitetskravButtons = () => {
  return (
    <FlexRow>
      <StyledKnapp>{texts.avventer}</StyledKnapp>
      <StyledKnapp>{texts.unntak}</StyledKnapp>
      <StyledKnapp>{texts.oppfylt}</StyledKnapp>
    </FlexRow>
  );
};
