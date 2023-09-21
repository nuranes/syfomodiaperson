export enum DocumentComponentType {
  HEADER = "HEADER",
  HEADER_H1 = "HEADER_H1",
  HEADER_H2 = "HEADER_H2",
  HEADER_H3 = "HEADER_H3",
  PARAGRAPH = "PARAGRAPH",
  BULLET_POINTS = "BULLET_POINTS",
  LINK = "LINK",
}

export interface DocumentComponentDto {
  readonly type: DocumentComponentType;
  readonly key?: string;
  readonly title?: string;
  readonly texts: string[];
}
