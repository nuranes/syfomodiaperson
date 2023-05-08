import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";

export const hasUbehandletPersonoppgave = (
  personOppgaver: PersonOppgave[],
  type: string
): boolean => numberOfUbehandledePersonOppgaver(personOppgaver, type) > 0;

export const numberOfUbehandledePersonOppgaver = (
  personOppgaver: PersonOppgave[],
  type: string
): number => {
  return getAllUbehandledePersonOppgaver(personOppgaver, type).length;
};

export const getAllUbehandledePersonOppgaver = (
  personOppgaver: PersonOppgave[],
  type: string
): PersonOppgave[] => {
  return personOppgaver.filter((personoppgave) => {
    return personoppgave.type === type && !isBehandletOppgave(personoppgave);
  });
};

export const getAllBehandledePersonOppgaver = (
  personOppgaver: PersonOppgave[],
  type: string
): PersonOppgave[] => {
  return personOppgaver.filter((personoppgave) => {
    return personoppgave.type === type && isBehandletOppgave(personoppgave);
  });
};

export const isBehandletOppgave = (personOppgave: PersonOppgave): boolean => {
  return (
    !!personOppgave.behandletTidspunkt && !!personOppgave.behandletVeilederIdent
  );
};
