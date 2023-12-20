const texts = {
  oppfolgingsgrunn: {
    taKontaktSykmeldt: "Ta kontakt med den sykmeldte",
    taKontaktArbeidsgiver: "Ta kontakt med arbeidsgiver",
    taKontaktBehandler: "Ta kontakt med behandler",
    vurderDialogmoteSenere: "Vurder behov for dialogmøte",
    folgOppEtterNesteSykmelding: "Følg opp etter neste sykmelding",
    vurderTiltakBehov: "Vurder behov for tiltak",
    annet:
      "Annet (Gi tilbakemelding i Pilotgruppa på Teams hvilket avhukingsvalg du savner)",
  },
};

export interface HuskelappRequestDTO {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  frist: string | null;
}

export interface HuskelappResponseDTO {
  uuid: string;
  createdBy: string;
  updatedAt: Date;
  createdAt: Date;
  tekst?: string;
  oppfolgingsgrunn?: Oppfolgingsgrunn;
  frist: string | null;
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

export const oppfolgingsgrunnToText = {
  [Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT]:
    texts.oppfolgingsgrunn.taKontaktSykmeldt,
  [Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER]:
    texts.oppfolgingsgrunn.taKontaktArbeidsgiver,
  [Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER]:
    texts.oppfolgingsgrunn.taKontaktBehandler,
  [Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE]:
    texts.oppfolgingsgrunn.vurderDialogmoteSenere,
  [Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING]:
    texts.oppfolgingsgrunn.folgOppEtterNesteSykmelding,
  [Oppfolgingsgrunn.VURDER_TILTAK_BEHOV]:
    texts.oppfolgingsgrunn.vurderTiltakBehov,
  [Oppfolgingsgrunn.ANNET]: texts.oppfolgingsgrunn.annet,
};
