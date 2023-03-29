export enum DocumentComponentType {
  HEADER = "HEADER",
  HEADER_H1 = "HEADER_H1",
  HEADER_H2 = "HEADER_H2",
  PARAGRAPH = "PARAGRAPH",
  LINK = "LINK",
}

export interface DocumentComponentDto {
  readonly type: DocumentComponentType;
  readonly key?: string;
  readonly title?: string;
  readonly texts: string[];
}
