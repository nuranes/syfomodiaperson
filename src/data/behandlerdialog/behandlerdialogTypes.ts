import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface MeldingTilBehandlerDTO {
  type: MeldingType;
  behandlerRef: string;
  tekst: string;
  document: DocumentComponentDto[];
  behandlerIdent?: string;
  behandlerNavn?: string;
}

export interface PaminnelseDTO {
  document: DocumentComponentDto[];
}

export interface ReturLegeerklaringDTO {
  document: DocumentComponentDto[];
  tekst: string;
}

export interface MeldingResponseDTO {
  conversations: Conversations;
}

export interface Conversations {
  [key: string]: MeldingDTO[];
}

export interface MeldingDTO {
  uuid: string;
  conversationRef: string;
  parentRef: string | null;
  behandlerRef: string;
  behandlerNavn: string | null;
  tekst: string;
  tidspunkt: Date;
  innkommende: boolean;
  type: MeldingType;
  document: DocumentComponentDto[];
  antallVedlegg: number;
  status?: MeldingStatusDTO;
  veilederIdent: string | null;
}

export interface MeldingStatusDTO {
  type: MeldingStatusType;
  tekst: string | null;
}

export enum MeldingStatusType {
  BESTILT = "BESTILT",
  SENDT = "SENDT",
  OK = "OK",
  AVVIST = "AVVIST",
}

export enum MeldingType {
  FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER = "FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER",
  FORESPORSEL_PASIENT_LEGEERKLARING = "FORESPORSEL_PASIENT_LEGEERKLARING",
  FORESPORSEL_PASIENT_PAMINNELSE = "FORESPORSEL_PASIENT_PAMINNELSE",
  HENVENDELSE_RETUR_LEGEERKLARING = "HENVENDELSE_RETUR_LEGEERKLARING",
}
