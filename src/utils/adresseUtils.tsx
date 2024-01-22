import React from "react";
import {
  Bostedsadresse,
  Kontaktadresse,
  KontaktadresseType,
  Matrikkeladresse,
  Oppholdsadresse,
  PostadresseIFrittFormat,
  Postboksadresse,
  UkjentBosted,
  UtenlandskAdresse,
  UtenlandskAdresseIFrittFormat,
  Vegadresse,
} from "@/data/personinfo/types/PersonAdresse";

const emdashCharacterCode = 8212;
const EMDASH = String.fromCharCode(emdashCharacterCode);

export const formaterBostedsadresse = (
  bostedsadresse: Bostedsadresse | undefined
) => {
  if (bostedsadresse) {
    if (bostedsadresse.vegadresse) {
      return formaterVegadresse(bostedsadresse.vegadresse);
    } else if (bostedsadresse.matrikkeladresse) {
      return formaterMatrikkeladresse(bostedsadresse.matrikkeladresse);
    } else if (bostedsadresse.utenlandskAdresse) {
      return formaterUtenlandskAdresse(bostedsadresse.utenlandskAdresse);
    } else if (bostedsadresse.ukjentBosted) {
      return formaterUkjentBosted(bostedsadresse.ukjentBosted);
    }
  }
  return <span className="adresselinje">{EMDASH}</span>;
};

export const formaterKontaktadresse = (
  kontaktadresse: Kontaktadresse | undefined
) => {
  if (kontaktadresse) {
    if (kontaktadresse.type === KontaktadresseType.Innland) {
      return formaterKontaktadresseInnland(kontaktadresse);
    } else if (kontaktadresse.type === KontaktadresseType.Utland) {
      return formaterKontaktadresseUtland(kontaktadresse);
    }
  }
  return <span className="adresselinje">{EMDASH}</span>;
};

const formaterKontaktadresseInnland = (kontaktadresse: Kontaktadresse) => {
  if (kontaktadresse.postboksadresse) {
    return formaterPostboksadresse(kontaktadresse.postboksadresse);
  } else if (kontaktadresse.vegadresse) {
    return formaterVegadresse(kontaktadresse.vegadresse);
  } else if (kontaktadresse.postadresseIFrittFormat) {
    return formaterPostadresseIFrittFormat(
      kontaktadresse.postadresseIFrittFormat
    );
  }

  return <span className="adresselinje">{EMDASH}</span>;
};

const formaterKontaktadresseUtland = (kontaktadresse: Kontaktadresse) => {
  if (kontaktadresse.utenlandskAdresse) {
    return formaterUtenlandskAdresse(kontaktadresse.utenlandskAdresse);
  } else if (kontaktadresse.utenlandskAdresseIFrittFormat) {
    return formaterUtenlandskAdresseIFrittFormat(
      kontaktadresse.utenlandskAdresseIFrittFormat
    );
  }

  return <span className="adresselinje">{EMDASH}</span>;
};

export const formaterOppholdsadresse = (
  oppholdsadresse: Oppholdsadresse | undefined
) => {
  if (oppholdsadresse) {
    if (oppholdsadresse.vegadresse) {
      return formaterVegadresse(oppholdsadresse.vegadresse);
    } else if (oppholdsadresse.matrikkeladresse) {
      return formaterMatrikkeladresse(oppholdsadresse.matrikkeladresse);
    } else if (oppholdsadresse.utenlandskAdresse) {
      return formaterUtenlandskAdresse(oppholdsadresse.utenlandskAdresse);
    } else if (oppholdsadresse.oppholdAnnetSted) {
      return formaterOppholdAnnetSted(oppholdsadresse.oppholdAnnetSted);
    }
  }
  return <span className="adresselinje">{EMDASH}</span>;
};

const formaterOppholdAnnetSted = (oppholdAnnetSted: string) => {
  return hentAdresseRader(oppholdAnnetSted || "", "", "", "", "");
};

const formaterPostboksadresse = (postboksadresse: Postboksadresse) => {
  return hentAdresseRader(
    postboksadresse.postbokseier || "",
    postboksadresse.postboks,
    `${postboksadresse.postnummer || ""} ${postboksadresse.poststed || ""}`,
    "",
    ""
  );
};

const formaterPostadresseIFrittFormat = (
  postadresseIFrittFormat: PostadresseIFrittFormat
) => {
  return hentAdresseRader(
    postadresseIFrittFormat.adresselinje1 || "",
    postadresseIFrittFormat.adresselinje2 || "",
    postadresseIFrittFormat.adresselinje3 || "",
    `${postadresseIFrittFormat.postnummer || ""} ${
      postadresseIFrittFormat.poststed || ""
    }`,
    ""
  );
};

const formaterVegadresse = (vegadresse: Vegadresse) => {
  return hentAdresseRader(
    `${vegadresse.adressenavn || ""} ${vegadresse.husnummer || ""} ${
      vegadresse.husbokstav || ""
    }`,
    vegadresse.tilleggsnavn || "",
    `${vegadresse.postnummer || ""} ${vegadresse.poststed || ""}`,
    "",
    ""
  );
};

const formaterMatrikkeladresse = (matrikkeladresse: Matrikkeladresse) => {
  return hentAdresseRader(
    matrikkeladresse.bruksenhetsnummer || "",
    matrikkeladresse.tilleggsnavn || "",
    `${matrikkeladresse.postnummer || ""} ${matrikkeladresse.poststed || ""}`,
    matrikkeladresse.kommunenummer || "",
    ""
  );
};

const formaterUtenlandskAdresse = (utenlandskAdresse: UtenlandskAdresse) => {
  return hentAdresseRader(
    `${utenlandskAdresse.adressenavnNummer} ${utenlandskAdresse.bygningEtasjeLeilighet}`,
    utenlandskAdresse.postboksNummerNavn || "",
    utenlandskAdresse.postkode || "",
    `${utenlandskAdresse.bySted || ""} ${
      utenlandskAdresse.regionDistriktOmraade || ""
    } `,
    utenlandskAdresse.landkode
  );
};

const formaterUtenlandskAdresseIFrittFormat = (
  utenlandskAdresseIFrittFormat: UtenlandskAdresseIFrittFormat
) => {
  return hentAdresseRader(
    utenlandskAdresseIFrittFormat.adresselinje1 || "",
    utenlandskAdresseIFrittFormat.adresselinje2 || "",
    utenlandskAdresseIFrittFormat.adresselinje3 || "",
    `${utenlandskAdresseIFrittFormat.postkode || ""} ${
      utenlandskAdresseIFrittFormat.byEllerStedsnavn || ""
    }`,
    utenlandskAdresseIFrittFormat.landkode
  );
};

const formaterUkjentBosted = (ukjentBosted: UkjentBosted) => {
  return hentAdresseRader(ukjentBosted.bostedskommune || "", "", "", "", "");
};

const hentAdresseRader = (
  rad1: string,
  rad2: string,
  rad3: string,
  rad4: string,
  rad5: string
) => {
  return (
    <div>
      <span className="adresselinje">{rad1}</span>
      <span className="adresselinje">{rad2}</span>
      <span className="adresselinje">{rad3}</span>
      <span className="adresselinje">{rad4}</span>
      <span className="adresselinje">{rad5}</span>
    </div>
  );
};
