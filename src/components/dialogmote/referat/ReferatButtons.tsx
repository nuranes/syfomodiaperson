import React, { ReactElement } from "react";
import { FlexRow, PaddingSize } from "../../Layout";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import Knapp, { Flatknapp, Hovedknapp } from "nav-frontend-knapper";

const texts = {
  save: "Lagre",
  send: "Lagre og send",
  abort: "Avbryt",
};

interface ReferatButtonsProps {
  onSaveClick: () => void;
  onSendClick: () => void;
  pageTitle: string;
  showSaveSpinner: boolean;
  showSendSpinner: boolean;
}

const HovedKnapp = styled(Hovedknapp)`
  margin-right: 1em;
  transform: none;
`;
const LagreKnapp = styled(Knapp)`
  margin-right: 1em;
`;

const ReferatButtons = ({
  onSaveClick,
  onSendClick,
  showSaveSpinner,
  showSendSpinner,
}: ReferatButtonsProps): ReactElement => (
  <FlexRow topPadding={PaddingSize.LG}>
    <LagreKnapp
      htmlType="button"
      onClick={onSaveClick}
      autoDisableVedSpinner
      spinner={showSaveSpinner}
    >
      {texts.save}
    </LagreKnapp>
    <HovedKnapp
      htmlType="submit"
      onClick={onSendClick}
      autoDisableVedSpinner
      spinner={showSendSpinner}
    >
      {texts.send}
    </HovedKnapp>
    <Link to={moteoversiktRoutePath}>
      <Flatknapp htmlType="button">{texts.abort}</Flatknapp>
    </Link>
  </FlexRow>
);

export default ReferatButtons;
