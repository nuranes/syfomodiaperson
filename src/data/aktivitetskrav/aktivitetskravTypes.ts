export enum AktivitetskravStatus {
  NY = "NY",
  AVVENT = "AVVENT",
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  AUTOMATISK_OPPFYLT = "AUTOMATISK_OPPFYLT",
  STANS = "STANS",
}

export interface AktivitetskravResponseDTO {
  uuid: string;
  createdAt: Date;
  sistEndret: Date;
  status: AktivitetskravStatus;
  stoppunktAt: Date;
  vurderinger: AktivitetskravVurderingResponseDTO[];
}

export interface AktivitetskravVurderingResponseDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  status: AktivitetskravStatus;
  beskrivelse?: string;
}

export interface AktivitetskravVurderingRequestDTO {
  status: AktivitetskravStatus;
  beskrivelse?: string;
}
