import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";

const texts = {
  behandleOppgaveText:
    "Jeg har forstått at meldingen ikke ble levert. Oppgaven kan fjernes.",
};

interface AvvistMeldingProps {
  meldingUuid: string;
}

export const AvvistMelding = ({ meldingUuid }: AvvistMeldingProps) => {
  const behandleOppgave = useBehandlePersonoppgave();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const avvistOppgave = oppgaver
    .filter(
      (oppgave) =>
        oppgave.type === PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST
    )
    .find((oppgave) => oppgave.referanseUuid === meldingUuid);

  return !!avvistOppgave ? (
    <BehandlePersonOppgaveKnapp
      personOppgave={avvistOppgave}
      behandleOppgaveText={texts.behandleOppgaveText}
      handleBehandleOppgave={() => behandleOppgave.mutate(avvistOppgave.uuid)}
      isBehandleOppgaveLoading={behandleOppgave.isPending}
      isBehandlet={isBehandletOppgave(avvistOppgave)}
    />
  ) : null;
};
