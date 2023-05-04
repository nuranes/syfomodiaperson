import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface MeldingTilBehandlerDTO {
  behandlerRef: string;
  tekst: string;
  document: DocumentComponentDto[];
  behandlerIdent?: string;
  behandlerNavn?: string;
}

export interface MeldingResponseDTO {
  conversations: Conversations;
}

export interface Conversations {
  [key: string]: Melding[];
}

export interface Melding {
  uuid: string;
  behandlerRef: string;
  behandlerNavn: string | null;
  tekst: string;
  tidspunkt: Date;
  innkommende: boolean;
  document: DocumentComponentDto[];
  antallVedlegg: number;
}
