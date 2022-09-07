export enum UnntakArsak {
  MEDISINSKE_GRUNNER = "MEDISINSKE_GRUNNER",
  INNLEGGELSE_INSTITUSJON = "INNLEGGELSE_INSTITUSJON",
  FRISKMELDT = "FRISKMELDT",
  FORVENTET_FRISKMELDING_INNEN_28UKER = "FORVENTET_FRISKMELDING_INNEN_28UKER",
  DOKUMENTERT_TILTAK_FRISKMELDING = "DOKUMENTERT_TILTAK_FRISKMELDING",
  ARBEIDSFORHOLD_OPPHORT = "ARBEIDSFORHOLD_OPPHORT",
}

export interface UnntakDTO {
  uuid: string;
  createdAt: Date;
  createdBy: string;
  personIdent: string;
  arsak: UnntakArsak;
  beskrivelse?: string;
}

export interface CreateUnntakDTO {
  personIdent: string;
  arsak: UnntakArsak;
  beskrivelse?: string;
}
