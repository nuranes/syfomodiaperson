import React from "react";
import styled from "styled-components";
import { ModalType } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { Button } from "@navikt/ds-react";

const texts = {
  avventer: "Avventer",
  oppfylt: "Er i aktivitet",
  unntak: "Sett unntak",
  ikkeOppfylt: "Ikke oppfylt",
  ikkeAktuell: "Ikke aktuell",
};

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  gap: 1em;
  padding-top: 2em;
  padding-bottom: 1em;
`;

interface VurderAktivitetskravButtonsProps {
  onButtonClick: (modalType: ModalType) => void;
}

export const VurderAktivitetskravButtons = ({
  onButtonClick,
}: VurderAktivitetskravButtonsProps) => {
  return (
    <ButtonRow>
      <Button variant="secondary" onClick={() => onButtonClick("AVVENT")}>
        {texts.avventer}
      </Button>
      <Button variant="secondary" onClick={() => onButtonClick("UNNTAK")}>
        {texts.unntak}
      </Button>
      <Button variant="secondary" onClick={() => onButtonClick("OPPFYLT")}>
        {texts.oppfylt}
      </Button>
      <Button variant="secondary" onClick={() => onButtonClick("IKKE_OPPFYLT")}>
        {texts.ikkeOppfylt}
      </Button>
      <Button
        variant="secondary-neutral"
        onClick={() => onButtonClick("IKKE_AKTUELL")}
      >
        {texts.ikkeAktuell}
      </Button>
    </ButtonRow>
  );
};
