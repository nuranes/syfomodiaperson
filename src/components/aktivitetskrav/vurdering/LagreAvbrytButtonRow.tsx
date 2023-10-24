import React from "react";
import { Button } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
};

interface VurderAktivitetskravSkjemaButtonsProps {
  isSubmitting: boolean;
  handleClose: () => void;
}

export const LagreAvbrytButtonRow = ({
  isSubmitting,
  handleClose,
}: VurderAktivitetskravSkjemaButtonsProps) => {
  return (
    <ButtonRow>
      <Button loading={isSubmitting} type="submit">
        {texts.lagre}
      </Button>
      <Button variant="tertiary" onClick={handleClose}>
        {texts.avbryt}
      </Button>
    </ButtonRow>
  );
};
