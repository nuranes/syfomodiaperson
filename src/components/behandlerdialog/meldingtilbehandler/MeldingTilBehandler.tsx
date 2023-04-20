import React from "react";
import { MeldingTilBehandlerSkjema } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Heading } from "@navikt/ds-react";

export const texts = {
  header: "Skriv til behandler",
  alertInfo:
    "Her kan du be om tilleggsopplysninger vedrørende pasienten. Behandleren honoreres med takst L8.",
};

export const MeldingTilBehandler = () => {
  return (
    <>
      <Heading level="1" size="large" spacing>
        {texts.header}
      </Heading>
      <Alert variant="info" size="small">
        {texts.alertInfo}
      </Alert>
      <MeldingTilBehandlerSkjema />
    </>
  );
};
