import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface ForhandsvarselRequestDTO {
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
