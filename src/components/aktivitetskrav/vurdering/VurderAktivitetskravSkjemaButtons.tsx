import { Flatknapp, Hovedknapp } from "nav-frontend-knapper";
import { FlexRow } from "@/components/Layout";
import React from "react";
import styled from "styled-components";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
};

const LagreButton = styled(Hovedknapp)`
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
      <LagreButton
        autoDisableVedSpinner
        htmlType="submit"
        spinner={showLagreSpinner}
      >
        {texts.lagre}
      </LagreButton>
      <Flatknapp onClick={onAvbrytClick}>{texts.avbryt}</Flatknapp>
    </FlexRow>
  );
};
