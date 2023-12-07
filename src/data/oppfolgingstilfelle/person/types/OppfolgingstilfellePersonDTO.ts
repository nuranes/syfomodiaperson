export interface OppfolgingstilfellePersonDTO {
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[];
  personIdent: string;
}

export interface OppfolgingstilfelleDTO {
  arbeidstakerAtTilfelleEnd: boolean;
  start: Date;
  end: Date;
  varighetUker: number;
  virksomhetsnummerList: string[];
}
