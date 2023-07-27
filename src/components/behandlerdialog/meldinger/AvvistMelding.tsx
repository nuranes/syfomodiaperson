import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import { Alert } from "@navikt/ds-react";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

const texts = {
  behandleOppgaveText:
    "Jeg har registrert at meldingen ikke ble sendt og funnet andre måter å kontakte behandleren på.",
};

interface AvvistMeldingProps {
  avvistMeldingStatusTekst: string | null;
  meldingUuid: string;
}

export const AvvistMelding = ({
  avvistMeldingStatusTekst,
  meldingUuid,
}: AvvistMeldingProps) => {
  const { isFeatureEnabled } = useFeatureToggles();
  const isAvvistMeldingOppgaveEnabled = isFeatureEnabled(
    ToggleNames.avvistMeldingOppgave
  );
  const behandleOppgave = useBehandlePersonoppgave();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const avvistOppgave = oppgaver
    .filter(
      (oppgave) =>
        oppgave.type === PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST
    )
    .find((oppgave) => oppgave.referanseUuid === meldingUuid);

  return (
    <>
      {avvistMeldingStatusTekst && (
        <Alert variant="error">{avvistMeldingStatusTekst}</Alert>
      )}
      {isAvvistMeldingOppgaveEnabled && avvistOppgave && (
        <BehandlePersonOppgaveKnapp
          personOppgave={avvistOppgave}
          behandleOppgaveText={texts.behandleOppgaveText}
          handleBehandleOppgave={() =>
            behandleOppgave.mutate(avvistOppgave.uuid)
          }
          isBehandleOppgaveLoading={behandleOppgave.isLoading}
          isBehandlet={isBehandletOppgave(avvistOppgave)}
        />
      )}
    </>
  );
};
