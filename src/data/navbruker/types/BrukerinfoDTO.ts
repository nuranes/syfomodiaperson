export interface KontaktinfoDTO {
  epost?: string;
  tlf?: string;
  skalHaVarsel: boolean;
}

export interface BrukerinfoDTO {
  navn: string;
  kontaktinfo?: KontaktinfoDTO;
  arbeidssituasjon: string;
  dodsdato: string | null;
  tilrettelagtKommunikasjon: TilrettelagtKommunikasjon | null;
  sikkerhetstiltak: Sikkerhetstiltak[];
}

interface TilrettelagtKommunikasjon {
  talesprakTolk: Sprak | null;
  tegnsprakTolk: Sprak | null;
}

interface Sprak {
  value: string | null;
}

/* https://pdl-docs.dev.intern.nav.no/ekstern/index.html#_sikkerhetstiltak */
enum Tiltakstype {
  FYUS = "FYUS",
  TFUS = "TFUS",
  FTUS = "FTUS",
  DIUS = "DIUS",
  TOAN = "TOAN",
}

interface Sikkerhetstiltak {
  type: Tiltakstype;
  beskrivelse: string;
  gyldigFom: Date;
  gyldigTom: Date;
}
