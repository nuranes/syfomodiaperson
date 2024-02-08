import { isISODateString } from "nav-datovelger";
import { ReferatSkjemaValues } from "@/components/dialogmote/referat/Referat";
import { genererDato } from "@/sider/mote/utils";
import { containsWhiteSpace } from "@/utils/stringUtils";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import dayjs from "dayjs";

export interface SkjemaFeil {
  [key: string]: string | undefined;
}

interface Tidspunkt {
  klokkeslett?: string;
  dato?: string;
}

const MAX_LENGTH_STED = 200;

export const texts = {
  dateMissing: "Vennligst angi gyldig dato",
  dateWrongFormat:
    "Datoen er ikke gyldig eller har ikke riktig format (dd.mm.åååå)",
  timeMissing: "Vennligst angi klokkeslett",
  timePassed: "Tidspunktet har passert",
  placeMissing: "Vennligst angi møtested",
  textTooLong: (maxLength: number) => `Maks ${maxLength} tegn tillatt`,
  orgMissing: "Vennligst velg arbeidsgiver",
  orgInvalid: "Vennligst fyll inn et gyldig virksomhetsnummer",
  behandlerMissing: "Vennligst velg behandler",
  arbeidsgiverDeltakerMissing: "Minst én person må delta fra arbeidsgiver",
  andreDeltakereMissingFunksjon: "Vennligst angi funksjon på deltaker",
  andreDeltakereMissingNavn: "Vennligst angi navn på deltaker",
  invalidVideoLink: "Lenken må begynne med https://video.nav.no",
  whiteSpaceInVideoLink: "Lenken kan ikke inneholde mellomrom",
};

export const harFeilmeldinger = (errors: SkjemaFeil): boolean =>
  Object.values(errors).filter((value) => value !== undefined).length > 0;

export const validerArbeidsgiver = (orgNummer?: string): string | undefined => {
  if (!orgNummer || orgNummer === "VELG") {
    return texts.orgMissing;
  }
  if (orgNummer.length !== 9) {
    return texts.orgInvalid;
  }
  return undefined;
};

export const behandlerRefValidationErrors = (
  behandlerRef: string | undefined,
  allowNoBehandler: boolean
) => {
  if ((!allowNoBehandler && behandlerRef === "NONE") || !behandlerRef) {
    return texts.behandlerMissing;
  }
  return undefined;
};

export const validerSted = (
  sted?: string,
  maxLength?: number
): string | undefined => {
  if (undefinedOrEmpty(sted)) {
    return texts.placeMissing;
  } else if (maxLength && sted && sted.length > maxLength) {
    return texts.textTooLong(MAX_LENGTH_STED);
  } else {
    return undefined;
  }
};

export const validerDato = (
  value: string | undefined,
  minDate?: Date,
  maxDate?: Date
) => {
  if (!value) {
    return texts.dateMissing;
  } else if (!isISODateString(value)) {
    return texts.dateWrongFormat;
  } else if (
    minDate &&
    new Date(value) < dayjs(minDate).startOf("day").toDate()
  ) {
    return `Datoen må være etter ${toDatePrettyPrint(minDate)}`;
  } else if (
    maxDate &&
    new Date(value) > dayjs(maxDate).endOf("day").toDate()
  ) {
    return `Datoen må være før ${toDatePrettyPrint(maxDate)}`;
  } else {
    return undefined;
  }
};

export const validerKlokkeslett = (
  dato: string | undefined,
  klokkeslett: string | undefined
): string | undefined => {
  if (!klokkeslett) {
    return texts.timeMissing;
  }
  if (dato && klokkeslett) {
    const today = new Date();
    const generertDato = genererDato(dato, klokkeslett);

    if (new Date(generertDato) < today) {
      return texts.timePassed;
    }
  }
};

export const validerTidspunkt = (tidspunkt?: Tidspunkt): Partial<Tidspunkt> => {
  const feil: Partial<Tidspunkt> = {};
  if (!tidspunkt) {
    feil.klokkeslett = texts.timeMissing;
    feil.dato = texts.dateMissing;
  } else {
    const datoValue = tidspunkt.dato;
    if (!datoValue) {
      feil.dato = texts.dateMissing;
    } else if (!isISODateString(datoValue)) {
      feil.dato = texts.dateWrongFormat;
    }
    const klokkeslettValue = tidspunkt.klokkeslett;
    if (!klokkeslettValue) {
      feil.klokkeslett = texts.timeMissing;
    }

    if (isISODateString(datoValue) && klokkeslettValue) {
      const today = new Date();
      const generertDato = genererDato(tidspunkt.dato, tidspunkt.klokkeslett);

      if (new Date(generertDato) < today) {
        feil.klokkeslett = texts.timePassed;
      }
    }
  }

  return feil;
};

export const validerVideoLink = (videoLink?: string): string | undefined => {
  if (!videoLink) {
    return undefined;
  }

  try {
    const trimmedVideoLink = videoLink.trim();
    const url = new URL(trimmedVideoLink);
    if (url.origin !== "https://video.nav.no") {
      return texts.invalidVideoLink;
    }
    if (containsWhiteSpace(trimmedVideoLink)) {
      return texts.whiteSpaceInVideoLink;
    }
  } catch (err) {
    return texts.invalidVideoLink;
  }

  return undefined;
};

export const validerSkjemaTekster = <Tekster>(
  tekster: SkjemaTekster<Tekster>
): SkjemaTeksterFeil<Tekster> => {
  return Object.keys(tekster).reduce((feil, key) => {
    feil[key] = validerTekst(tekster[key]);
    return feil;
  }, {}) as SkjemaTeksterFeil<Tekster>;
};

type SkjemaTekster<Tekster> = {
  [K in keyof Tekster]: SkjemaTekst;
};

type SkjemaTekst = {
  value: string;
  maxLength: number;
  missingRequiredMessage?: string;
};

type SkjemaTeksterFeil<Tekster> = {
  [K in keyof Tekster]: string | undefined;
};

export const validerReferatDeltakere = (
  values: Partial<ReferatSkjemaValues>
): SkjemaFeil => {
  const { naermesteLeder, andreDeltakere } = values;
  const feil: SkjemaFeil = {};
  if (undefinedOrEmpty(naermesteLeder)) {
    feil.naermesteLeder = texts.arbeidsgiverDeltakerMissing;
  }
  andreDeltakere?.forEach(({ navn, funksjon }, index) => {
    if (undefinedOrEmpty(funksjon)) {
      feil[`andreDeltakere[${index}].funksjon`] =
        texts.andreDeltakereMissingFunksjon;
    }
    if (undefinedOrEmpty(navn)) {
      feil[`andreDeltakere[${index}].navn`] = texts.andreDeltakereMissingNavn;
    }
  });

  return feil;
};

export const validerTekst = (tekst: SkjemaTekst): string | undefined => {
  const { value, maxLength, missingRequiredMessage } = tekst;
  if (missingRequiredMessage && value.trim() === "") {
    return missingRequiredMessage;
  } else if (value !== undefined && value.length > maxLength) {
    return texts.textTooLong(maxLength);
  } else {
    return undefined;
  }
};

const undefinedOrEmpty = (value?: string): boolean => {
  return !value || value.trim() === "";
};
