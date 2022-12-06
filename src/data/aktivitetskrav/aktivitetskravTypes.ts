export enum AktivitetskravStatus {
  NY = "NY",
  AVVENT = "AVVENT",
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  AUTOMATISK_OPPFYLT = "AUTOMATISK_OPPFYLT",
  STANS = "STANS",
}

export interface AktivitetskravDTO {
  uuid: string;
  createdAt: Date;
  sistEndret: Date;
  status: AktivitetskravStatus;
  stoppunktAt: Date;
  vurderinger: AktivitetskravVurderingDTO[];
}

export interface AktivitetskravVurderingDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  status: AktivitetskravStatus;
  beskrivelse?: string;
}

export interface CreateAktivitetskravVurderingDTO {
  status: AktivitetskravStatus;
  beskrivelse?: string;
}
