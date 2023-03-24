export interface BehandlerDTO {
  type: BehandlerType;
  behandlerRef: string;
  fnr?: string;
  fornavn: string;
  mellomnavn?: string;
  etternavn: string;
  adresse?: string;
  orgnummer?: string;
  kontor?: string;
  postnummer?: string;
  poststed?: string;
  telefon?: string;
}

export enum BehandlerType {
  FASTLEGE = "FASTLEGE",
  SYKMELDER = "SYKMELDER",
}
