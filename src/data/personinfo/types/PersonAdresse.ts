export interface PersonAdresse {
  navn: string;
  bostedsadresse?: Bostedsadresse;
  kontaktadresse?: Kontaktadresse;
  oppholdsadresse?: Oppholdsadresse;
}

export interface Bostedsadresse {
  vegadresse?: Vegadresse;
  matrikkeladresse?: Matrikkeladresse;
  utenlandskAdresse?: UtenlandskAdresse;
  ukjentBosted?: UkjentBosted;
}

export interface Kontaktadresse {
  type: KontaktadresseType;
  postboksadresse?: Postboksadresse;
  vegadresse?: Vegadresse;
  postadresseIFrittFormat?: PostadresseIFrittFormat;
  utenlandskAdresse?: UtenlandskAdresse;
  utenlandskAdresseIFrittFormat?: UtenlandskAdresseIFrittFormat;
}

export enum KontaktadresseType {
  Innland = "Innland",
  Utland = "Utland",
}

export interface Oppholdsadresse {
  utenlandskAdresse?: UtenlandskAdresse;
  vegadresse?: Vegadresse;
  matrikkeladresse?: Matrikkeladresse;
  oppholdAnnetSted?: string;
}

export interface PostadresseIFrittFormat {
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postnummer?: string;
  poststed?: string;
}

export interface Postboksadresse {
  postbokseier?: string;
  postboks: string;
  postnummer?: string;
  poststed?: string;
}

export interface UtenlandskAdresse {
  adressenavnNummer?: string;
  bygningEtasjeLeilighet?: string;
  postboksNummerNavn?: string;
  postkode?: string;
  bySted?: string;
  regionDistriktOmraade?: string;
  landkode: string;
}

export interface UtenlandskAdresseIFrittFormat {
  adresselinje1?: string;
  adresselinje2?: string;
  adresselinje3?: string;
  postkode?: string;
  byEllerStedsnavn?: string;
  landkode: string;
}

export interface Vegadresse {
  husnummer?: string;
  husbokstav?: string;
  adressenavn?: string;
  tilleggsnavn?: string;
  postnummer?: string;
  poststed?: string;
}

export interface Matrikkeladresse {
  bruksenhetsnummer?: string;
  tilleggsnavn?: string;
  postnummer?: string;
  poststed?: string;
  kommunenummer?: string;
}

export interface UkjentBosted {
  bostedskommune?: string;
}
