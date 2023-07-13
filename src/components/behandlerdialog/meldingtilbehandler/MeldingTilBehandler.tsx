import React from "react";
import { MeldingTilBehandlerSkjema } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Alert, Heading } from "@navikt/ds-react";
import styled from "styled-components";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import AppSpinner from "@/components/AppSpinner";

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
              {texts.alert}
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
