import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface ReferatDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly ferdigstilt: boolean;
  readonly narmesteLederNavn: string;
  readonly situasjon: string;
  readonly konklusjon: string;
  readonly arbeidstakerOppgave: string;
  readonly arbeidsgiverOppgave: string;
  readonly veilederOppgave?: string;
  readonly behandlerOppgave?: string;
  readonly begrunnelseEndring?: string;
  readonly document: DocumentComponentDto[];
  readonly andreDeltakere: DialogmotedeltakerAnnenDTO[];
}

export interface DialogmotedeltakerAnnenDTO {
  readonly funksjon: string;
  readonly navn: string;
}

export type NewDialogmotedeltakerAnnenDTO = Pick<
  DialogmotedeltakerAnnenDTO,
  "funksjon" | "navn"
>;

export interface NewDialogmoteReferatDTO {
  narmesteLederNavn: string;
  situasjon: string;
  konklusjon: string;
  arbeidstakerOppgave: string;
  arbeidsgiverOppgave: string;
  behandlerOppgave?: string;
  veilederOppgave?: string;
  begrunnelseEndring?: string;
  document: DocumentComponentDto[];
  andreDeltakere: NewDialogmotedeltakerAnnenDTO[];
  behandlerDeltatt?: boolean;
  behandlerMottarReferat?: boolean;
}
