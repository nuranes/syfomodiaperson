export enum IkkeAktuellArsak {
  ARBEIDSTAKER_AAP = "ARBEIDSTAKER_AAP",
  ARBEIDSTAKER_DOD = "ARBEIDSTAKER_DOD",
  DIALOGMOTE_AVHOLDT = "DIALOGMOTE_AVHOLDT",
}

export interface CreateIkkeAktuellDTO {
  personIdent: string;
  arsak: IkkeAktuellArsak;
  beskrivelse?: string;
}
