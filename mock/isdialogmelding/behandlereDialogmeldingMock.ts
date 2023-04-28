export const behandlerRefLegoLasLegesen = "behandler-ref-uuid";
export const behandlerRefDoktorLegesen = "behandler-ref-annen-uuid";

export const behandlerLegoLasLegesen = {
  type: "FASTLEGE",
  fnr: "01010012345",
  behandlerRef: behandlerRefLegoLasLegesen,
  fornavn: "Lego",
  mellomnavn: "Las",
  etternavn: "Legesen",
  kontor: "PONTYPANDY LEGEKONTOR",
  adresse: "Branngata 2",
  postnummer: "1400",
  poststed: "Pontypandy",
  telefon: "12345678",
  orgnummer: "000999000",
};

export const behandlerDoktorLegesen = {
  type: "FASTLEGE",
  fnr: "01010012346",
  behandlerRef: behandlerRefDoktorLegesen,
  fornavn: "Doktor",
  mellomnavn: undefined,
  etternavn: "Legesen",
  kontor: "PONTYPANDY LEGEKONTOR",
  adresse: "Branngata 2",
  postnummer: "1400",
  poststed: "Pontypandy",
  telefon: "12345678",
  orgnummer: "000999000",
};

export const behandlereDialogmeldingMock = [behandlerLegoLasLegesen];

export const behandlerSokDialogmeldingMock = [
  {
    type: null,
    fnr: "01010012347",
    behandlerRef: "behandler-ref-uuid",
    fornavn: "Enda",
    mellomnavn: "Enny",
    etternavn: "Legesen",
    kontor: "FASTLEGEKRISE LEGEKONTOR",
    adresse: "Legegata 2",
    postnummer: "1400",
    poststed: "Pontypandy",
    telefon: "12345677",
    orgnummer: "000888000",
  },
  {
    type: null,
    fnr: "01010012348",
    behandlerRef: "behandler-ref-uuid",
    fornavn: "Kake",
    mellomnavn: "Bake",
    etternavn: "Baker",
    kontor: "FASTLEGEKRISE LEGEKONTOR",
    adresse: "Legegata 3",
    postnummer: "1400",
    poststed: "Pontypandy",
    telefon: "12345677",
    orgnummer: "000888001",
  },
];

export const behandlerByBehandlerRefMock = behandlerDoktorLegesen;
