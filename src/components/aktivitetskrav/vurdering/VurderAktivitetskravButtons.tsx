import React from "react";
import { FlexRow, PaddingSize } from "@/components/Layout";
import Knapp from "nav-frontend-knapper";
import styled from "styled-components";
import { ModalType } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";

const texts = {
  avventer: "(Avventer)",
  oppfylt: "Er i aktivitet",
  unntak: "Sett unntak",
};

const StyledKnapp = styled(Knapp)`
  margin-right: 1em;
`;

interface VurderAktivitetskravButtonsProps {
  onButtonClick: (modalType: ModalType) => void;
}

export const VurderAktivitetskravButtons = ({
  onButtonClick,
}: VurderAktivitetskravButtonsProps) => {
  return (
    <FlexRow topPadding={PaddingSize.MD}>
      <StyledKnapp onClick={() => onButtonClick("AVVENT")}>
        {texts.avventer}
      </StyledKnapp>
      <StyledKnapp onClick={() => onButtonClick("UNNTAK")}>
        {texts.unntak}
      </StyledKnapp>
      <StyledKnapp onClick={() => onButtonClick("OPPFYLT")}>
        {texts.oppfylt}
      </StyledKnapp>
    </FlexRow>
  );
};
