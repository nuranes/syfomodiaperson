import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface VedtakRequestDTO {
  fom: string;
  tom: string;
  begrunnelse: string;
  document: DocumentComponentDto[];
  behandlerRef: string;
  behandlerNavn: string;
  behandlerDocument: DocumentComponentDto[];
}
