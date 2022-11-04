import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";

export const isBehandletOppgave = (personOppgave: PersonOppgave): boolean => {
  return (
    !!personOppgave.behandletTidspunkt && !!personOppgave.behandletVeilederIdent
  );
};

export const hasUbehandletPersonOppgaveDialogmotesvar = (
  personOppgaver: PersonOppgave[]
): boolean => {
  return personOppgaver.some(
    (oppgave: PersonOppgave) =>
      oppgave.type === PersonOppgaveType.DIALOGMOTESVAR &&
      !isBehandletOppgave(oppgave)
  );
};
