import React from "react";
import { MeldingTilBehandlerSkjema } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  header: "Skriv til behandler",
  tilleggsopplysningerInfo:
    "Her kan du kun be om tilleggsopplysninger med takst L8. Dialogmeldingen skal bare benyttes i sykefraværsoppfølgingen.",
};

const MeldingTilBehandlerAlert = styled(Alert)`
  max-width: fit-content;
  margin-bottom: 1.5em;

  .navds-alert__wrapper {
    max-width: fit-content;
  }
`;

export const MeldingTilBehandler = () => {
  const { isFeatureEnabled, isLoading } = useFeatureToggles();
  const isBehandlerdialogLegeerklaringEnabled = isFeatureEnabled(
    ToggleNames.behandlerdialogLegeerklaring
  );

  return (
    <>
      <Heading level="1" size="large" spacing>
        {texts.header}
      </Heading>
      {isLoading ? (
        <AppSpinner />
      ) : (
        <>
          {!isBehandlerdialogLegeerklaringEnabled && (
            <MeldingTilBehandlerAlert variant="warning" size="small">
              {texts.tilleggsopplysningerInfo}
            </MeldingTilBehandlerAlert>
          )}
          <MeldingTilBehandlerSkjema
            isBehandlerdialogLegeerklaringEnabled={
              isBehandlerdialogLegeerklaringEnabled
            }
          />
        </>
      )}
    </>
  );
};
