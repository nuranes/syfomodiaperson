export interface PersonOppgave {
  uuid: string;
  referanseUuid: string;
  fnr: string;
  virksomhetsnummer: string;
  type: PersonOppgaveType;
  behandletTidspunkt: Date | null;
  behandletVeilederIdent: string | null;
  opprettet: Date;
}

export enum PersonOppgaveType {
  OPPFOLGINGSPLANLPS = "OPPFOLGINGSPLANLPS",
  DIALOGMOTESVAR = "DIALOGMOTESVAR",
  BEHANDLERDIALOG_SVAR = "BEHANDLERDIALOG_SVAR",
  BEHANDLERDIALOG_MELDING_UBESVART = "BEHANDLERDIALOG_MELDING_UBESVART",
}
