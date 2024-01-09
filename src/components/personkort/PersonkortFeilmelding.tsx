import React, { ReactNode } from "react";
import { Alert } from "@navikt/ds-react";

interface PersonkortFeilmeldingProps {
  children: ReactNode;
}

const PersonkortFeilmelding = ({ children }: PersonkortFeilmeldingProps) => {
  return (
    <Alert variant="info" size="small">
      {children}
    </Alert>
  );
};

export default PersonkortFeilmelding;
