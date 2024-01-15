import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { Button } from "@navikt/ds-react";

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

const ReferatButtons = ({
  onSaveClick,
  onSendClick,
  showSaveSpinner,
  showSendSpinner,
}: ReferatButtonsProps): ReactElement => (
  <div className="flex gap-4 pt-12">
    <Button
      type="button"
      variant="secondary"
      loading={showSaveSpinner}
      onClick={onSaveClick}
    >
      {texts.save}
    </Button>
    <Button
      type="submit"
      variant="primary"
      loading={showSendSpinner}
      onClick={onSendClick}
    >
      {texts.send}
    </Button>
    <Button
      as={Link}
      type="button"
      variant="tertiary"
      to={moteoversiktRoutePath}
    >
      {texts.abort}
    </Button>
  </div>
);

export default ReferatButtons;
