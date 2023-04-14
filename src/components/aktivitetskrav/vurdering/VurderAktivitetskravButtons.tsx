import React from "react";
import { ModalType } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravModal";
import { Button } from "@navikt/ds-react";
import { ButtonRow, PaddingSize } from "@/components/Layout";

const texts = {
  avventer: "Avventer",
  oppfylt: "Er i aktivitet",
  unntak: "Sett unntak",
  ikkeOppfylt: "Ikke oppfylt",
  ikkeAktuell: "Ikke aktuell",
};

interface VurderAktivitetskravButtonsProps {
  onButtonClick: (modalType: ModalType) => void;
}

export const VurderAktivitetskravButtons = ({
  onButtonClick,
}: VurderAktivitetskravButtonsProps) => {
  return (
    <ButtonRow topPadding={PaddingSize.MD}>
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
