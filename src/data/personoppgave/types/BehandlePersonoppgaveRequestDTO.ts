import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";

export interface BehandlePersonoppgaveRequestDTO {
  personIdent: string;
  personOppgaveType: PersonOppgaveType;
}
