import { firstLetterToUpperCase } from "./stringUtils";
import dayjs from "dayjs";

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
  "Søndag",
];

const SKILLETEGN_PERIODE = "–";

export const ANTALL_MS_DAG = 1000 * 60 * 60 * 24;

const pad = (int) => {
  if (int < 10) {
    return `0${int}`;
  }
  return int;
};

export const tilLesbarDatoUtenArstall = (datoArg) => {
  if (datoArg) {
    const dato = new Date(datoArg);
    const dag = dato.getUTCDate();
    const manedIndex = dato.getUTCMonth();
    const maned = maneder[manedIndex];
    return `${dag}. ${maned}`;
  }
  return null;
};

export const tilLesbarDatoMedArstall = (datoArg) => {
  return datoArg
    ? `${tilLesbarDatoUtenArstall(new Date(datoArg))} ${new Date(
        datoArg
      ).getUTCFullYear()}`
    : undefined;
};

export const tilLesbarPeriodeMedArstall = (fomArg, tomArg) => {
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

export const visDato = (d) => {
  const maned = maneder[d.getMonth()];
  return `${dager[d.getDay()]} ${d.getDate()}. ${maned} ${d.getFullYear()}`;
};

export const visKlokkeslett = (d) => {
  if (typeof d === "undefined" || d === null) {
    return null;
  }
  const hour = pad(d.getHours());
  const minute = pad(d.getMinutes());
  return `${hour}.${minute}`;
};

export const lagJsDate = (dato) => {
  if (dato) {
    return new Date(dato);
  }
  return dato;
};

export const konverterTid = (mote) => {
  return Object.assign({}, mote, {
    opprettetTidspunkt: lagJsDate(mote.opprettetTidspunkt),
    bekreftetAlternativ: mote.bekreftetAlternativ
      ? Object.assign({}, mote.bekreftetAlternativ, {
          tid: lagJsDate(mote.bekreftetAlternativ.tid),
          created: lagJsDate(mote.bekreftetAlternativ.created),
        })
      : null,
    bekreftetTidspunkt: mote.bekreftetTidspunkt
      ? lagJsDate(mote.bekreftetTidspunkt)
      : null,
    deltakere: mote.deltakere.map((deltaker) => {
      return Object.assign({}, deltaker, {
        svartidspunkt: lagJsDate(deltaker.svartidspunkt),
        svar: deltaker.svar.map((s) => {
          return Object.assign({}, s, {
            tid: lagJsDate(s.tid),
            created: lagJsDate(s.created),
          });
        }),
      });
    }),
    alternativer: mote.alternativer.map((alt) => {
      return Object.assign({}, alt, {
        tid: lagJsDate(alt.tid),
        created: lagJsDate(alt.created),
      });
    }),
  });
};

export const restdatoTildato = (restdato) => {
  const dato = restdato.split("T")[0];
  return dato.split("-").reverse().join(".");
};

export const restdatoTilLesbarDato = (restdato) => {
  const dato = restdato.split("T")[0];
  return tilLesbarDatoMedArstall(new Date(dato));
};

const maanedListe = [
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
const ukedagListe = [
  "søndag",
  "mandag",
  "tirsdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lørdag",
];

export const tilDatoMedManedNavn = (dato) => {
  const { dag, maaned, aar } = getDatoKomponenter(dato);
  return `${dag}. ${maaned} ${aar}`;
};

export const tilDatoMedUkedagOgManedNavn = (dato) => {
  const { ukeDag, dag, maaned, aar } = getDatoKomponenter(dato);
  return `${ukeDag} ${dag}. ${maaned} ${aar}`;
};

export const getDatoKomponenter = (dato) => {
  const nyDato = new Date(dato);
  const ukeDag = firstLetterToUpperCase(ukedagListe[nyDato.getDay()]);
  const dag = nyDato.getDate();
  const maaned = maanedListe[nyDato.getMonth()];
  const aar = nyDato.getFullYear();
  return {
    ukeDag,
    dag,
    maaned,
    aar,
  };
};

export const tilDatoMedManedNavnOgKlokkeslettWithComma = (dato) => {
  const newDate = new Date(dato);
  const date = tilDatoMedManedNavn(newDate);
  const time = visKlokkeslett(newDate);
  return `${date}, kl. ${time}`;
};

export const tilDatoMedManedNavnOgKlokkeslett = (dato) => {
  const newDate = new Date(dato);
  const date = tilDatoMedManedNavn(newDate);
  const time = visKlokkeslett(newDate);
  return `${date} kl. ${time}`;
};

export const tilDatoMedUkedagOgManedNavnOgKlokkeslett = (dato) => {
  const newDate = new Date(dato);
  const date = tilDatoMedUkedagOgManedNavn(newDate);
  const time = visKlokkeslett(newDate);
  return `${date} kl. ${time}`;
};

const dayOrMonthWithTwoDigits = (arg) => {
  return arg > 9 ? `${arg}` : `0${arg}`;
};

export const tilLesbarDatoMedArUtenManedNavn = (datoArg) => {
  const date = new Date(datoArg);
  const day = dayOrMonthWithTwoDigits(date.getDate());
  const month = dayOrMonthWithTwoDigits(date.getMonth() + 1);
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const tilLesbarPeriodeMedArUtenManednavn = (fomArg, tomArg) => {
  return `${tilLesbarDatoMedArUtenManedNavn(
    fomArg
  )} - ${tilLesbarDatoMedArUtenManedNavn(tomArg)}`;
};

export const dagerMellomDatoer = (startDato, sluttDato) => {
  return Math.round(
    Math.abs(
      (new Date(sluttDato).getTime() - new Date(startDato).getTime()) /
        ANTALL_MS_DAG
    )
  );
};

export const dagerMellomDatoerUtenAbs = (startDato, sluttDato) => {
  return Math.round(
    (sluttDato.getTime() - startDato.getTime()) / ANTALL_MS_DAG
  );
};

export const erIdag = (dato) => {
  const idag = new Date();
  dato = new Date(dato);
  return (
    dato.getDate() === idag.getDate() &&
    dato.getMonth() === idag.getMonth() &&
    dato.getFullYear() === idag.getFullYear()
  );
};

export const erIkkeIdag = (dato) => {
  return !erIdag(dato);
};

export const toDate = (dato) => {
  if (typeof dato === "undefined" || dato === null) {
    return undefined;
  } else if (
    typeof date === "string" &&
    dato.includes("T") &&
    !dato.includes("Z")
  ) {
    return new Date(`${dato}Z`);
  }
  return new Date(dato);
};

//TODO: Convert this util file to typescript
export const toDateWithoutNullCheck = (dato) => {
  if (typeof date === "string" && dato.includes("T") && !dato.includes("Z")) {
    return new Date(`${dato}Z`);
  }
  return new Date(dato);
};

export const toDatePrettyPrint = (dato) => {
  if (typeof dato === "undefined" || dato === null) {
    return undefined;
  }

  const _dato = toDate(dato);

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

export const getDuration = (from, to) => {
  return (
    Math.round(Math.floor(toDate(to) - toDate(from)) / (1000 * 60 * 60 * 24)) +
    1
  );
};

export const manederMellomDatoer = (d1, d2) => {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();

  if (d2.getDate() < d1.getDate()) {
    months -= 1;
  }
  return months <= 0 ? 0 : months;
};

export const addWeeks = (date, numberOfWeeks) => {
  return dayjs(date, { utc: true }).add(numberOfWeeks, "weeks").toDate();
};

const ONE_WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

export const getEarliestDate = (date1, date2) => {
  return new Date(date1) < new Date(date2) ? new Date(date1) : new Date(date2);
};

export const getWeeksSinceDate = (date) => {
  const now = new Date();
  return getWeeksBetween(new Date(date), now);
};

export const getWeeksBetween = (date1, date2) => {
  return Math.round(
    Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) /
      ONE_WEEK_MILLIS
  );
};
