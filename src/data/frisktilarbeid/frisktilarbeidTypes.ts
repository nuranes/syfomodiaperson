import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface VedtakRequestDTO {
  fom: string;
  tom: string;
  begrunnelse: string;
  document: DocumentComponentDto[];
}

export interface VedtakResponseDTO {
  uuid: string;
  createdAt: Date;
  veilederident: string;
  begrunnelse: string;
  fom: Date;
  tom: Date;
  document: DocumentComponentDto[];
  ferdigbehandletAt?: Date;
  ferdigbehandletBy?: string;
}
