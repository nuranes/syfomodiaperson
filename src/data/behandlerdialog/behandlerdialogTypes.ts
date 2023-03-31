import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface MeldingTilBehandlerDTO {
  behandlerRef: string;
  tekst: string;
  document: DocumentComponentDto[];
}

export interface MeldingResponseDTO {
  conversations: Conversations;
}

export interface Conversations {
  [key: string]: Melding[];
}

export interface Melding {
  behandlerRef: string;
  tekst: string;
  tidspunkt: Date;
  innkommende: boolean;
}
