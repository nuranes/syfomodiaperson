import { FlexRow } from "@/components/Layout";
import React from "react";
import styled from "styled-components";
import { Button } from "@navikt/ds-react";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
};

const LagreButton = styled(Button)`
  margin-right: 1em;
`;

interface VurderAktivitetskravSkjemaButtonsProps {
  onAvbrytClick: () => void;
  showLagreSpinner: boolean;
}

export const VurderAktivitetskravSkjemaButtons = ({
  onAvbrytClick,
  showLagreSpinner,
}: VurderAktivitetskravSkjemaButtonsProps) => {
  return (
    <FlexRow>
      <LagreButton loading={showLagreSpinner} type="submit">
        {texts.lagre}
      </LagreButton>
      <Button variant="tertiary" onClick={onAvbrytClick}>
        {texts.avbryt}
      </Button>
    </FlexRow>
  );
};
