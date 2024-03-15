export interface Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  telefonnummer?: string;
}

export class Veileder {
  ident: string;
  fornavn: string;
  etternavn: string;
  epost: string;
  telefonnummer?: string;

  constructor(
    ident: string,
    fornavn: string,
    etternavn: string,
    epost: string,
    telefonnummer?: string
  ) {
    this.ident = ident;
    this.fornavn = fornavn;
    this.etternavn = etternavn;
    this.epost = epost;
    this.telefonnummer = telefonnummer;
  }

  fulltNavn(): string {
    return this.fornavn + " " + this.etternavn;
  }
}
