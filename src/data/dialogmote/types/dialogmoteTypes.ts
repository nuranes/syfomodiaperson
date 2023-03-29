import { ReferatDTO } from "./dialogmoteReferatTypes";
import { BehandlerType } from "@/data/behandler/BehandlerDTO";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export enum MotedeltakerVarselType {
  AVLYST = "AVLYST",
  INNKALT = "INNKALT",
  REFERAT = "REFERAT",
  NYTT_TID_STED = "NYTT_TID_STED",
}

export interface DialogmotedeltakerVarselDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly lestDato?: string;
  readonly varselType: MotedeltakerVarselType;
  readonly fritekst: string;
  readonly document: DocumentComponentDto[];
  readonly svar?: VarselSvarDTO;
}

export interface DialogmotedeltakerArbeidstakerVarselDTO
  extends DialogmotedeltakerVarselDTO {
  readonly digitalt: boolean;
}

export interface DialogmotedeltakerArbeidsgiverVarselDTO
  extends DialogmotedeltakerVarselDTO {
  readonly status: string;
}

export interface VarselSvarDTO {
  readonly svarTidspunkt: string;
  readonly svarType: SvarType;
  readonly svarTekst?: string;
}

export interface DialogmotedeltakerBehandlerVarselDTO
  extends Omit<DialogmotedeltakerVarselDTO, "lestDato" | "svar"> {
  readonly svar: DialogmotedeltakerBehandlerVarselSvarDTO[];
}

export interface DialogmotedeltakerBehandlerVarselSvarDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly svarType: SvarType;
  readonly tekst?: string;
}

export enum SvarType {
  KOMMER = "KOMMER",
  NYTT_TID_STED = "NYTT_TID_STED",
  KOMMER_IKKE = "KOMMER_IKKE",
}

export enum DialogmoteStatus {
  INNKALT = "INNKALT",
  AVLYST = "AVLYST",
  FERDIGSTILT = "FERDIGSTILT",
  NYTT_TID_STED = "NYTT_TID_STED",
  LUKKET = "LUKKET",
}

export interface DialogmotedeltakerArbeidstakerDTO {
  readonly personIdent: string;
  readonly type: string;
  readonly varselList: DialogmotedeltakerArbeidstakerVarselDTO[];
}

export interface DialogmotedeltakerArbeidsgiverDTO {
  readonly virksomhetsnummer: string;
  readonly type: string;
  readonly varselList: DialogmotedeltakerArbeidsgiverVarselDTO[];
}

export interface DialogmotedeltakerBehandlerDTO {
  readonly uuid: string;
  readonly personIdent?: string;
  readonly behandlerRef: string;
  readonly behandlerNavn: string;
  readonly behandlerKontor: string;
  readonly behandlerType: BehandlerType;
  readonly type: string;
  readonly varselList: DialogmotedeltakerBehandlerVarselDTO[];
  readonly deltatt: boolean;
  readonly mottarReferat: boolean;
}

export interface DialogmoteInnkallingDTO {
  arbeidstaker: {
    personIdent: string;
    fritekstInnkalling?: string;
    innkalling: DocumentComponentDto[];
  };
  arbeidsgiver: {
    virksomhetsnummer: string;
    fritekstInnkalling?: string;
    innkalling: DocumentComponentDto[];
  };
  behandler?: {
    personIdent?: string;
    behandlerRef: string;
    behandlerNavn: string;
    behandlerKontor: string;
    fritekstInnkalling?: string;
    innkalling: DocumentComponentDto[];
  };
  tidSted: TidStedDto;
}

export interface EndreTidStedDialogmoteDTO extends TidStedDto {
  arbeidstaker: {
    begrunnelse: string;
    endringsdokument: DocumentComponentDto[];
  };
  arbeidsgiver: {
    begrunnelse: string;
    endringsdokument: DocumentComponentDto[];
  };
  behandler?: {
    begrunnelse: string;
    endringsdokument: DocumentComponentDto[];
  };
}

export interface TidStedDto {
  sted: string;
  tid: string;
  videoLink?: string;
}

export interface AvlysDialogmoteDTO {
  arbeidstaker: AvlysningDto;
  arbeidsgiver: AvlysningDto;
  behandler?: AvlysningDto;
}

interface AvlysningDto {
  begrunnelse: string;
  avlysning: DocumentComponentDto[];
}

export interface DialogmoteDTO {
  readonly uuid: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly planlagtMoteBekreftetTidspunkt?: string;
  readonly status: DialogmoteStatus;
  readonly opprettetAv: string;
  readonly tildeltVeilederIdent: string;
  readonly tildeltEnhet: string;
  readonly arbeidstaker: DialogmotedeltakerArbeidstakerDTO;
  readonly arbeidsgiver: DialogmotedeltakerArbeidsgiverDTO;
  readonly behandler?: DialogmotedeltakerBehandlerDTO;
  readonly sted: string;
  readonly tid: string;
  readonly videoLink?: string;
  readonly referatList: ReferatDTO[];
}
