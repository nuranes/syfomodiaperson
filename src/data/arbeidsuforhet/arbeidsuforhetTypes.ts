import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface VurderingRequestDTO {
  type: VurderingType;
  begrunnelse: string;
  document: DocumentComponentDto[];
}

export enum VurderingType {
  FORHANDSVARSEL = "FORHANDSVARSEL",
  OPPFYLT = "OPPFYLT",
  AVSLAG = "AVSLAG",
}

interface VarselDTO {
  uuid: string;
  createdAt: Date;
  svarfrist: Date;
}

export interface VurderingResponseDTO {
  uuid: string;
  personident: string;
  createdAt: Date;
  veilederident: string;
  type: VurderingType;
  begrunnelse: string;
  document: DocumentComponentDto[];
  varsel: VarselDTO | undefined;
}
