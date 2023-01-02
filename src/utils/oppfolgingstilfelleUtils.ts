import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import dayjs from "dayjs";
import {
  MIN_DAYS_IN_LONG_TILFELLE,
  THREE_YEARS_AGO_IN_MONTHS,
} from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { dagerMellomDatoer } from "@/utils/datoUtils";

const daysInTilfelle = (tilfelle: OppfolgingstilfelleDTO) => {
  return dagerMellomDatoer(tilfelle.start, tilfelle.end) + 1;
};

const hasManySykefravar = (tilfeller: number, sickdays: number) => {
  return tilfeller > 4 && sickdays > 100;
};

const hasLongSykefravar = (tilfeller: number, sickdays: number) => {
  return tilfeller > 1 && sickdays > 300;
};

const accumulateSickdays = (acc: number, dayCount: number) => acc + dayCount;

const isLongTilfelle = (tilfelle: OppfolgingstilfelleDTO) => {
  const numberOfDaysInTilfelle = daysInTilfelle(tilfelle);
  return numberOfDaysInTilfelle >= MIN_DAYS_IN_LONG_TILFELLE;
};

const isRecentTilfelle = (tilfelle: OppfolgingstilfelleDTO) => {
  const threeYearsAgo = dayjs(new Date())
    .subtract(THREE_YEARS_AGO_IN_MONTHS, "month")
    .toDate();
  const tilfelleEnd = dayjs(tilfelle.end);

  return (
    tilfelleEnd.isAfter(threeYearsAgo, "day") ||
    tilfelleEnd.isSame(threeYearsAgo, "day")
  );
};

export const isGjentakendeSykefravar = (
  tilfeller: OppfolgingstilfelleDTO[]
) => {
  const relevantTilfeller = tilfeller
    .filter(isLongTilfelle)
    .filter(isRecentTilfelle);

  const tilfelleCount = relevantTilfeller.length;
  const accumulatedSickDays = relevantTilfeller
    .map(daysInTilfelle)
    .reduce(accumulateSickdays, 0);

  return (
    hasManySykefravar(tilfelleCount, accumulatedSickDays) ||
    hasLongSykefravar(tilfelleCount, accumulatedSickDays)
  );
};

const latestTilfelleDifference = (
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
) => {
  return new Date(b.start).getTime() - new Date(a.start).getTime();
};

const longestTilfelleDifference = (
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
) => {
  return new Date(b.end).getTime() - new Date(a.end).getTime();
};

const byLatestAndLongestTilfelle = (
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
) => {
  const startDateDifference = latestTilfelleDifference(a, b);
  if (startDateDifference === 0) {
    return longestTilfelleDifference(a, b);
  }
  return startDateDifference;
};

export const sortByDescendingStart = (
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO[] => {
  return oppfolgingstilfelleList.sort(byLatestAndLongestTilfelle);
};
