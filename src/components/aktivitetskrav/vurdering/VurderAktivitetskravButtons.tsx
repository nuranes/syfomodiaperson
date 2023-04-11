import React from "react";
import { FlexRow, PaddingSize } from "@/components/Layout";
import styled from "styled-components";
import { ModalType } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { Button } from "@navikt/ds-react";

const texts = {
  avventer: "Avventer",
  oppfylt: "Er i aktivitet",
  unntak: "Sett unntak",
  ikkeOppfylt: "Ikke oppfylt",
};

const StyledButton = styled(Button)`
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
      <StyledButton variant="secondary" onClick={() => onButtonClick("AVVENT")}>
        {texts.avventer}
      </StyledButton>
      <StyledButton variant="secondary" onClick={() => onButtonClick("UNNTAK")}>
        {texts.unntak}
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => onButtonClick("OPPFYLT")}
      >
        {texts.oppfylt}
      </StyledButton>
      <StyledButton
        variant="secondary"
        onClick={() => onButtonClick("IKKE_OPPFYLT")}
      >
        {texts.ikkeOppfylt}
      </StyledButton>
    </FlexRow>
  );
};
