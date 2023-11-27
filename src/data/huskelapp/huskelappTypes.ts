export interface HuskelappRequestDTO {
  oppfolgingsgrunn: Oppfolgingsgrunn;
}

export interface HuskelappResponseDTO {
  uuid: string;
  createdBy: string;
  tekst?: string;
  oppfolgingsgrunn?: Oppfolgingsgrunn;
}

export enum Oppfolgingsgrunn {
  TA_KONTAKT_SYKEMELDT = "TA_KONTAKT_SYKEMELDT",
  TA_KONTAKT_ARBEIDSGIVER = "TA_KONTAKT_ARBEIDSGIVER",
  TA_KONTAKT_BEHANDLER = "TA_KONTAKT_BEHANDLER",
  VURDER_DIALOGMOTE_SENERE = "VURDER_DIALOGMOTE_SENERE",
  FOLG_OPP_ETTER_NESTE_SYKMELDING = "FOLG_OPP_ETTER_NESTE_SYKMELDING",
  VURDER_TILTAK_BEHOV = "VURDER_TILTAK_BEHOV",
  ANNET = "ANNET",
}
