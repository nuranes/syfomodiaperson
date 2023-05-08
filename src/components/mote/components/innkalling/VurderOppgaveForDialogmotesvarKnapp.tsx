import React from "react";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { useBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { isBehandletOppgave } from "@/utils/personOppgaveUtils";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";

const texts = {
  fjernOppgave:
    "Jeg har vurdert alle møtesvarene. Oppgaven kan fjernes fra oversikten.",
};

interface VurderTilbakemeldingPaInnkallingKnappProps {
  personOppgave: PersonOppgave;
}

const VurderOppgaveForDialogmotesvarKnapp = ({
  personOppgave,
}: VurderTilbakemeldingPaInnkallingKnappProps) => {
  const isBehandlet = isBehandletOppgave(personOppgave);
  const behandlePersonOppgave = useBehandlePersonoppgave();

  return (
    <BehandlePersonOppgaveKnapp
      personOppgave={personOppgave}
      isBehandlet={isBehandlet}
      handleBehandleOppgave={() =>
        behandlePersonOppgave.mutate(personOppgave.uuid)
      }
      isBehandleOppgaveLoading={behandlePersonOppgave.isLoading}
      behandleOppgaveText={texts.fjernOppgave}
    />
  );
};

export default VurderOppgaveForDialogmotesvarKnapp;
