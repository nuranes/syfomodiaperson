import { ButtonRow } from "@/components/Layout";
import React from "react";
import { Button } from "@navikt/ds-react";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
};

interface VurderAktivitetskravSkjemaButtonsProps {
  onAvbrytClick: () => void;
  showLagreSpinner: boolean;
}

export const VurderAktivitetskravSkjemaButtons = ({
  onAvbrytClick,
  showLagreSpinner,
}: VurderAktivitetskravSkjemaButtonsProps) => {
  return (
    <ButtonRow>
      <Button loading={showLagreSpinner} type="submit">
        {texts.lagre}
      </Button>
      <Button variant="tertiary" onClick={onAvbrytClick}>
        {texts.avbryt}
      </Button>
    </ButtonRow>
  );
};
