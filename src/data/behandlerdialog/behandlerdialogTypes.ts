export interface MeldingTilBehandlerDTO {
  behandlerRef: string;
  tekst: string;
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
