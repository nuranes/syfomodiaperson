export enum AktivitetskravStatus {
  NY = "NY",
  AVVENT = "AVVENT",
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  AUTOMATISK_OPPFYLT = "AUTOMATISK_OPPFYLT",
  STANS = "STANS",
  IKKE_OPPFYLT = "IKKE_OPPFYLT",
  IKKE_AKTUELL = "IKKE_AKTUELL",
}

export enum AvventVurderingArsak {
  OPPFOLGINGSPLAN_ARBEIDSGIVER = "OPPFOLGINGSPLAN_ARBEIDSGIVER",
  INFORMASJON_BEHANDLER = "INFORMASJON_BEHANDLER",
  ANNET = "ANNET",
}

export enum UnntakVurderingArsak {
  MEDISINSKE_GRUNNER = "MEDISINSKE_GRUNNER",
  TILRETTELEGGING_IKKE_MULIG = "TILRETTELEGGING_IKKE_MULIG",
  SJOMENN_UTENRIKS = "SJOMENN_UTENRIKS",
}

export enum OppfyltVurderingArsak {
  FRISKMELDT = "FRISKMELDT",
  GRADERT = "GRADERT",
  TILTAK = "TILTAK",
}

export interface AktivitetskravDTO {
  uuid: string;
  createdAt: Date;
  status: AktivitetskravStatus;
  stoppunktAt: Date;
  vurderinger: AktivitetskravVurderingDTO[];
}

export interface AktivitetskravVurderingDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  status: AktivitetskravStatus;
  beskrivelse: string | undefined;
  arsaker: VurderingArsak[];
  frist: Date | undefined;
}

export type VurderingArsak =
  | AvventVurderingArsak
  | UnntakVurderingArsak
  | OppfyltVurderingArsak;

export interface CreateAktivitetskravVurderingDTO {
  status: AktivitetskravStatus;
  beskrivelse?: string;
  arsaker: VurderingArsak[];
  frist?: string;
}
