import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

export interface ForhandsvarselRequestDTO {
  begrunnelse: string;
  document: DocumentComponentDto[];
}
