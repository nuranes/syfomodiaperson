import { firstLetterToUpperCase } from "./stringUtils";
import dayjs from "dayjs";
import { Malform } from "../context/malform/MalformContext";

const maneder = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];
const dager = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
];

const nynorskDager = [
  "Søndag",
  "Måndag",
  "Tysdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Laurdag",
];

const SKILLETEGN_PERIODE = "–";

export const ANTALL_MS_DAG = 1000 * 60 * 60 * 24;

const pad = (int: number): string | number => {
  if (int < 10) {
    return `0${int}`;
  }
  return int;
};

export const tilLesbarDatoUtenArstall = (datoArg): string | null => {
  if (datoArg) {
    const dato = new Date(datoArg);
    const dag = dato.getUTCDate();
    const manedIndex = dato.getUTCMonth();
    const maned = maneder[manedIndex];
    return `${dag}. ${maned}`;
  }
  return null;
};

export const tilLesbarDatoMedArstall = (datoArg): string | undefined => {
  return datoArg
    ? `${tilLesbarDatoUtenArstall(new Date(datoArg))} ${new Date(
        datoArg
      ).getUTCFullYear()}`
    : undefined;
};

export const tilLesbarPeriodeMedArstall = (fomArg, tomArg): string => {
  const fom = new Date(fomArg);
  const tom = new Date(tomArg);
  const erSammeAr = fom.getUTCFullYear() === tom.getUTCFullYear();
  const erSammeManed = fom.getUTCMonth() === tom.getUTCMonth();
  return erSammeAr && erSammeManed
    ? `${fom.getUTCDate()}. ${SKILLETEGN_PERIODE} ${tilLesbarDatoMedArstall(
        tom
      )}`
    : erSammeAr
    ? `${tilLesbarDatoUtenArstall(
        fom
      )} ${SKILLETEGN_PERIODE} ${tilLesbarDatoMedArstall(tom)}`
    : `${tilLesbarDatoMedArstall(
        fom
      )} ${SKILLETEGN_PERIODE} ${tilLesbarDatoMedArstall(tom)}`;
};

export const visDato = (d: Date): string => {
  const maned = maneder[d.getMonth()];
  return `${dager[d.getDay()]} ${d.getDate()}. ${maned} ${d.getFullYear()}`;
};

export const getManedText = (d: Date): string => {
  return maneder[d.getMonth()];
};

export const visKlokkeslett = (d: Date): string | null => {
  if (typeof d === "undefined" || d === null) {
    return null;
  }
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  return `${hour}.${minute}`;
};

export const showTimeIncludingSeconds = (d: Date): string | null => {
  if (typeof d === "undefined" || d === null) {
    return null;
  }
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  const second = pad(d.getSeconds());
  return `${hour}:${minute}:${second}`;
};

export const restdatoTildato = (restdato) => {
  const dato = restdato.split("T")[0];
  return dato.split("-").reverse().join(".");
};

export const restdatoTilLesbarDato = (restdato) => {
  const dato = restdato.split("T")[0];
  return tilLesbarDatoMedArstall(new Date(dato));
};

export const tilDatoMedManedNavn = (dato): string => {
  const { dag, maaned, aar } = getDatoKomponenter(dato);
  return `${dag}. ${maaned} ${aar}`;
};

export const tilDatoMedUkedagOgManedNavn = (
  dato: Date | string,
  malform?: Malform
): string => {
  const { ukeDag, dag, maaned, aar } = getDatoKomponenter(dato, malform);
  return `${ukeDag} ${dag}. ${maaned} ${aar}`;
};

export const getDatoKomponenter = (dato: Date | string, malform?: Malform) => {
  const nyDato = new Date(dato);
  const ukeDag = firstLetterToUpperCase(
    malform !== Malform.NYNORSK
      ? dager[nyDato.getDay()]
      : nynorskDager[nyDato.getDay()]
  );
  const dag = nyDato.getDate();
  const maaned = maneder[nyDato.getMonth()];
  const aar = nyDato.getFullYear();
  return {
    ukeDag,
    dag,
    maaned,
    aar,
  };
};

export const tilDatoMedManedNavnOgKlokkeslettWithComma = (dato): string => {
  const newDate = new Date(dato);
  const date = tilDatoMedManedNavn(newDate);
  const time = visKlokkeslett(newDate);
  return `${date}, kl. ${time}`;
};

export const tilDatoMedManedNavnOgKlokkeslett = (dato): string => {
  const newDate = new Date(dato);
  const date = tilDatoMedManedNavn(newDate);
  const time = visKlokkeslett(newDate);
  return `${date} kl. ${time}`;
};

export const tilDatoMedUkedagOgManedNavnOgKlokkeslett = (
  dato: Date | string,
  malform?: Malform
): string => {
  const newDate = new Date(dato);
  const date = tilDatoMedUkedagOgManedNavn(newDate, malform);
  const time = visKlokkeslett(newDate);
  return `${date} kl. ${time}`;
};

const dayOrMonthWithTwoDigits = (arg): string => {
  return arg > 9 ? `${arg}` : `0${arg}`;
};

export const tilLesbarDatoMedArUtenManedNavn = (datoArg): string => {
  const date = new Date(datoArg);
  const day = dayOrMonthWithTwoDigits(date.getDate());
  const month = dayOrMonthWithTwoDigits(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const tilLesbarPeriodeMedArUtenManednavn = (fomArg, tomArg): string => {
  return `${tilLesbarDatoMedArUtenManedNavn(
    fomArg
  )} - ${tilLesbarDatoMedArUtenManedNavn(tomArg)}`;
};

export const dagerMellomDatoer = (startDato, sluttDato): number => {
  return Math.round(
    Math.abs(
      (new Date(sluttDato).getTime() - new Date(startDato).getTime()) /
        ANTALL_MS_DAG
    )
  );
};

export const dagerMellomDatoerUtenAbs = (startDato, sluttDato): number => {
  return Math.round(
    (sluttDato.getTime() - startDato.getTime()) / ANTALL_MS_DAG
  );
};

export const erIdag = (dato): boolean => {
  const idag = new Date();
  dato = new Date(dato);
  return (
    dato.getDate() === idag.getDate() &&
    dato.getMonth() === idag.getMonth() &&
    dato.getFullYear() === idag.getFullYear()
  );
};

export const erIkkeIdag = (dato): boolean => {
  return !erIdag(dato);
};

export const toDate = (dato): Date | undefined => {
  if (typeof dato === "undefined" || dato === null) {
    return undefined;
  } else if (
    typeof dato === "string" &&
    dato.includes("T") &&
    !dato.includes("Z")
  ) {
    return new Date(`${dato}Z`);
  }
  return new Date(dato);
};

export const toDateWithoutNullCheck = (dato): Date => {
  if (typeof dato === "string" && dato.includes("T") && !dato.includes("Z")) {
    return new Date(`${dato}Z`);
  }
  return new Date(dato);
};

export const toDatePrettyPrint = (dato): string | undefined => {
  const _dato = toDate(dato);
  if (typeof _dato === "undefined" || _dato === null) {
    return undefined;
  }

  const days =
    _dato.getUTCDate() < 10
      ? `0${_dato.getUTCDate()}`
      : `${_dato.getUTCDate()}`;
  const months =
    _dato.getUTCMonth() + 1 < 10
      ? `0${_dato.getUTCMonth() + 1}`
      : `${_dato.getUTCMonth() + 1}`;
  const years = _dato.getUTCFullYear();

  return `${days}.${months}.${years}`;
};

export const getDuration = (from: Date, to: Date): number => {
  return (
    Math.round(
      Math.floor(
        toDateWithoutNullCheck(to).getTime() -
          toDateWithoutNullCheck(from).getTime()
      ) / ANTALL_MS_DAG
    ) + 1
  );
};

export const manederMellomDatoer = (d1, d2): number => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();

  if (d2.getDate() < d1.getDate()) {
    months -= 1;
  }
  return months <= 0 ? 0 : months;
};

export const addWeeks = (date: Date, numberOfWeeks: number): Date => {
  return dayjs(date).add(numberOfWeeks, "weeks").toDate();
};

export const getWeeksBetween = (date1, date2): number => {
  return Math.abs(dayjs(date1).diff(date2, "week"));
};
