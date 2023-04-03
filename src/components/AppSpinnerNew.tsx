import { Row } from "nav-frontend-grid";
import React from "react";
import { Loader } from "@navikt/ds-react";

export const AppSpinnerNew = () => {
  return (
    <Row
      className="row-centered blokk--xl"
      aria-label="Vent litt mens siden laster"
    >
      <Loader size="xlarge" title="Vent litt mens siden laster" />
    </Row>
  );
};
