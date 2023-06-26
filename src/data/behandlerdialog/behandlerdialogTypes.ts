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

export interface MeldingResponseDTO {
  conversations: Conversations;
}

export interface Conversations {
  [key: string]: MeldingDTO[];
}

export interface MeldingDTO {
  uuid: string;
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

interface MeldingStatusDTO {
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
  FORESPORSEL_PASIENT = "FORESPORSEL_PASIENT", // TODO: Remove this after migrate isbehandlerdialog
  FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER = "FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER",
  FORESPORSEL_PASIENT_PAMINNELSE = "FORESPORSEL_PASIENT_PAMINNELSE",
}
