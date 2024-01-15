import React from "react";
import { Alert } from "@navikt/ds-react";

const texts = {
  noNarmesteleder:
    "Det er ikke registrert en nærmeste leder fra denne arbeidsgiveren, derfor sender vi dette brevet automatisk " +
    "til Altinn. Lederen må registrere seg som nærmeste leder i Altinn for å kunne gi svar på Nav.no.",
};

export const NoNarmesteLederAlert = () => (
  <Alert variant="warning" size="small" className="mb-4 [&>*]:max-w-fit">
    {texts.noNarmesteleder}
  </Alert>
);
