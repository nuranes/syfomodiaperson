import React from "react";
import { Row } from "nav-frontend-grid";
import { Loader } from "@navikt/ds-react";

const AppSpinner = () => {
  return (
    <Row
      className="row-centered blokk--xl"
      aria-label="Vent litt mens siden laster"
    >
      <Loader size="2xlarge" title="Venter...">
        Vent litt mens siden laster
      </Loader>
    </Row>
  );
};

export default AppSpinner;
