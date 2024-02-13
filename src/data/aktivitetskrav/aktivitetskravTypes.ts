import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export enum AktivitetskravStatus {
  NY = "NY",
  NY_VURDERING = "NY_VURDERING",
  AVVENT = "AVVENT",
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  AUTOMATISK_OPPFYLT = "AUTOMATISK_OPPFYLT",
  FORHANDSVARSEL = "FORHANDSVARSEL",
  STANS = "STANS",
  IKKE_OPPFYLT = "IKKE_OPPFYLT",
  IKKE_AKTUELL = "IKKE_AKTUELL",
  LUKKET = "LUKKET",
}

export enum AvventVurderingArsak {
  OPPFOLGINGSPLAN_ARBEIDSGIVER = "OPPFOLGINGSPLAN_ARBEIDSGIVER",
  INFORMASJON_BEHANDLER = "INFORMASJON_BEHANDLER",
  INFORMASJON_SYKMELDT = "INFORMASJON_SYKMELDT",
  DROFTES_MED_ROL = "DROFTES_MED_ROL",
  DROFTES_INTERNT = "DROFTES_INTERNT",
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

export enum IkkeAktuellArsak {
  INNVILGET_VTA = "INNVILGET_VTA",
  MOTTAR_AAP = "MOTTAR_AAP",
  ER_DOD = "ER_DOD",
  ANNET = "ANNET",
}

export enum VarselType {
  FORHANDSVARSEL_STANS_AV_SYKEPENGER = "FORHANDSVARSEL_STANS_AV_SYKEPENGER",
  UNNTAK = "UNNTAK",
  OPPFYLT = "OPPFYLT",
  IKKE_AKTUELL = "IKKE_AKTUELL",
}

export interface AktivitetskravDTO {
  uuid: string;
  createdAt: Date;
  status: AktivitetskravStatus;
  inFinalState: boolean;
  stoppunktAt: Date;
  vurderinger: AktivitetskravVurderingDTO[];
}

export interface AktivitetskravHistorikkDTO {
  tidspunkt: Date;
  status: AktivitetskravStatus;
  vurdertAv: string | null;
}

export interface AktivitetskravVurderingDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  status: AktivitetskravStatus;
  beskrivelse: string | undefined;
  arsaker: VurderingArsak[];
  frist: Date | undefined;
  varsel: AktivitetskravVarselDTO | undefined;
}

export interface AktivitetskravVarselDTO {
  uuid: string;
  createdAt: Date;
  svarfrist: Date;
  document: DocumentComponentDto[];
}

export type VurderingArsak =
  | AvventVurderingArsak
  | UnntakVurderingArsak
  | OppfyltVurderingArsak
  | IkkeAktuellArsak;

export interface CreateAktivitetskravVurderingDTO {
  status: AktivitetskravStatus;
  beskrivelse?: string;
  arsaker: VurderingArsak[];
  document?: DocumentComponentDto[];
  frist?: string;
}

export interface SendForhandsvarselDTO {
  fritekst: string;
  document: DocumentComponentDto[];
}

export interface NewAktivitetskravDTO {
  previousAktivitetskravUuid: string;
}
