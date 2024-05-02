import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";

export interface OppfolgingsplanLPS {
  uuid: string;
  fnr: string;
  virksomhetsnummer: string;
  opprettet: string;
  sistEndret: string;
}

export type OppfolgingsplanLPSMedPersonoppgave = OppfolgingsplanLPS & {
  personoppgave?: PersonOppgave;
};
