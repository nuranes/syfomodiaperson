import { Button } from "@navikt/ds-react";
import React from "react";

const texts = {
  close: "Lukk",
};

interface CloseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const CloseButton = ({ onClick, disabled }: CloseButtonProps) => (
  <Button variant="tertiary" disabled={disabled} onClick={onClick}>
    {texts.close}
  </Button>
);
