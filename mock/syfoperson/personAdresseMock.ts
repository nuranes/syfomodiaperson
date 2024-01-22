import { ARBEIDSTAKER_DEFAULT_FULL_NAME } from "../common/mockConstants";
import { Vegadresse } from "@/data/personinfo/types/PersonAdresse";

export const vegadresse: Vegadresse = {
  husnummer: "20",
  adressenavn: "ØKERNVEIEN",
  postnummer: "0301",
  poststed: "OSLO",
};

export const personAdresseMock = {
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  bostedsadresse: {
    vegadresse,
    matrikkeladresse: null,
    utenlandskAdresse: null,
    ukjentBosted: null,
  },
  kontaktadresse: {
    type: "Utland",
    postboksadresse: null,
    vegadresse: null,
    postadresseIFrittFormat: null,
    utenlandskAdresse: null,
    utenlandskAdresseIFrittFormat: {
      adresselinje1: "Gate1",
      adresselinje2: "Gate2",
      adresselinje3: "Gate3",
      postkode: null,
      byEllerStedsnavn: null,
      landkode: "DZA",
    },
  },
  oppholdsadresse: {
    utenlandskAdresse: null,
    vegadresse,
    matrikkeladresse: null,
    oppholdAnnetSted: null,
  },
};
