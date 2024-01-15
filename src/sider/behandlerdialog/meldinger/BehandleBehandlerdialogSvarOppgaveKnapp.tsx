import React from "react";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useBehandleAllPersonoppgaver } from "@/data/personoppgave/useBehandlePersonoppgave";
import BehandlePersonOppgaveKnapp from "@/components/personoppgave/BehandlePersonOppgaveKnapp";
import { BehandlePersonoppgaveRequestDTO } from "@/data/personoppgave/types/BehandlePersonoppgaveRequestDTO";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  getAllBehandledePersonOppgaver,
  hasUbehandletPersonoppgave,
} from "@/utils/personOppgaveUtils";
import { FlexRow } from "@/components/Layout";

const texts = {
  fjernOppgave:
    "Marker nye meldinger som lest. Oppgaven vil da fjernes fra oversikten.",
};

const sortDateByTidspunkt = (d1: Date | null, d2: Date | null) => {
  if (d1 === null) return 1;
  if (d2 === null) return -1;
  return new Date(d2).getTime() - new Date(d1).getTime();
};
const getSisteBehandledeBehandlerdialogSvarOppgave = (
  personOppgaver: PersonOppgave[]
): PersonOppgave | undefined => {
  return getAllBehandledePersonOppgaver(
    personOppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_SVAR
  ).sort((a, b) =>
    sortDateByTidspunkt(a.behandletTidspunkt, b.behandletTidspunkt)
  )[0];
};

const BehandleBehandlerdialogSvarOppgaveKnapp = () => {
  const { data: personOppgaver } = usePersonoppgaverQuery();
  const hasBehandlerDialogSvarOppgaver = personOppgaver.some(
    (p) => p.type === PersonOppgaveType.BEHANDLERDIALOG_SVAR
  );
  const fnr = useValgtPersonident();
  const behandleAllPersonoppgaver = useBehandleAllPersonoppgaver();
  const isBehandlet = !hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_SVAR
  );
  const behandlePersonOppgaveRequestDTO: BehandlePersonoppgaveRequestDTO = {
    personIdent: fnr,
    personOppgaveType: PersonOppgaveType.BEHANDLERDIALOG_SVAR,
  };
  const sisteBehandledeOppgave =
    getSisteBehandledeBehandlerdialogSvarOppgave(personOppgaver);

  return (
    <FlexRow>
      {hasBehandlerDialogSvarOppgaver && (
        <BehandlePersonOppgaveKnapp
          personOppgave={sisteBehandledeOppgave}
          isBehandlet={isBehandlet}
          handleBehandleOppgave={() =>
            behandleAllPersonoppgaver.mutate(behandlePersonOppgaveRequestDTO)
          }
          isBehandleOppgaveLoading={behandleAllPersonoppgaver.isPending}
          behandleOppgaveText={texts.fjernOppgave}
        />
      )}
    </FlexRow>
  );
};

export default BehandleBehandlerdialogSvarOppgaveKnapp;
