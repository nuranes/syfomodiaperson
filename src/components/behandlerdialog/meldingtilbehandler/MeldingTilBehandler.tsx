import React from "react";
import { MeldingTilBehandlerSkjema } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Heading } from "@navikt/ds-react";
import styled from "styled-components";

export const texts = {
  header: "Skriv til behandler",
  alert:
    "Her kan du kun be om tilleggsopplysninger med takst L8. Dialogmeldingen skal bare benyttes i sykefraværsoppfølgingen.",
};

const MeldingTilBehandlerAlert = styled(Alert)`
  .navds-alert__wrapper {
    max-width: fit-content;
  }
`;

export const MeldingTilBehandler = () => {
  return (
    <>
      <Heading level="1" size="large" spacing>
        {texts.header}
      </Heading>
      <MeldingTilBehandlerAlert variant="warning" size="small">
        {texts.alert}
      </MeldingTilBehandlerAlert>
      <MeldingTilBehandlerSkjema />
    </>
  );
};
