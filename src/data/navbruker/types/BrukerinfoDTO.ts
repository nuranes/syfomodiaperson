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
}

interface TilrettelagtKommunikasjon {
  talesprakTolk: Sprak | null;
  tegnsprakTolk: Sprak | null;
}

interface Sprak {
  value: string | null;
}
