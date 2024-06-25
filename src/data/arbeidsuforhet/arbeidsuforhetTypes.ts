import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface VurderingRequestDTO {
  type: VurderingType;
  arsak?: VurderingArsak;
  begrunnelse: string;
  document: DocumentComponentDto[];
  gjelderFom?: string;
}

export enum VurderingType {
  FORHANDSVARSEL = "FORHANDSVARSEL",
  OPPFYLT = "OPPFYLT",
  AVSLAG = "AVSLAG",
  IKKE_AKTUELL = "IKKE_AKTUELL",
}

export const typeTexts: {
  [key in VurderingType]: string;
} = {
  [VurderingType.FORHANDSVARSEL]: "Forhåndsvarsel",
  [VurderingType.OPPFYLT]: "Oppfylt",
  [VurderingType.AVSLAG]: "Avslag",
  [VurderingType.IKKE_AKTUELL]: "Ikke aktuell",
};

export enum VurderingArsak {
  FRISKMELDT = "FRISKMELDT",
  FRISKMELDING_TIL_ARBEIDSFORMIDLING = "FRISKMELDING_TIL_ARBEIDSFORMIDLING",
}

export const arsakTexts: {
  [key in VurderingArsak]: string;
} = {
  [VurderingArsak.FRISKMELDT]: "Friskmeldt",
  [VurderingArsak.FRISKMELDING_TIL_ARBEIDSFORMIDLING]:
    "Friskmelding til arbeidsformidling",
};

export interface VarselDTO {
  uuid: string;
  createdAt: Date;
  svarfrist: Date;
  isExpired: boolean;
}

export interface VurderingResponseDTO {
  uuid: string;
  personident: string;
  createdAt: Date;
  veilederident: string;
  type: VurderingType;
  arsak: VurderingArsak | undefined;
  begrunnelse: string;
  document: DocumentComponentDto[];
  varsel: VarselDTO | undefined;
}
