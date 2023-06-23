import {
  KvinneImage,
  MannImage,
  PepperkakeKvinneImage,
  PepperkakeMannImage,
} from "../../img/ImageComponents";
import Snowflakes from "magic-snowflakes";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

enum Month {
  DECEMBER = 11,
}

export const isDecember = () => {
  const currentMonth = new Date().getMonth();

  return currentMonth === Month.DECEMBER;
};

export const getKvinneImage = () => {
  if (isDecember()) {
    return PepperkakeKvinneImage;
  }
  return KvinneImage;
};

export const getMannImage = () => {
  if (isDecember()) {
    return PepperkakeMannImage;
  }
  return MannImage;
};

const snowflakes = new Snowflakes({
  count: 30,
  speed: 2,
});
snowflakes.stop();

export const startSnow = () => {
  if (isDecember()) {
    snowflakes.show();
    snowflakes.start();
  }
};

export const stopAndHideSnow = () => {
  snowflakes.hide();
  snowflakes.stop();
};

interface EasterSundayNumbers {
  year: number;
  month: number;
  day: number;
}

/**
 * Calculates Easter in the Gregorian/Western (Catholic and Protestant) calendar
 * based on the algorithm by Oudin (1940) from http://www.tondering.dk/claus/cal/easter.php
 */
const getEasterSunday = (year): EasterSundayNumbers => {
  const f = Math.floor,
    // Golden Number - 1
    G = year % 19,
    C = f(year / 100),
    // related to Epact
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    // number of days from 21 March to the Paschal full moon
    I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)),
    // weekday for the Paschal full moon
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    // number of days from 21 March to the Sunday on or before the Paschal full moon
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);

  return {
    year: year,
    month: month,
    day: day,
  };
};

const isEasterDate = (date: Date) => {
  const { year, month, day } = getEasterSunday(date.getFullYear());

  const easterSunday = dayjs(date)
    .year(year)
    .month(month - 1)
    .date(day)
    .hour(0)
    .minute(0)
    .second(0)
    .millisecond(0);

  const easterStartDate = easterSunday.clone().subtract(10, "days");
  const dayAfterEasterEndDate = easterSunday.clone().add(2, "days");
  return dayjs(date) < dayAfterEasterEndDate && dayjs(date) >= easterStartDate;
};

export const isEaster = () => {
  const today = new Date(Date.now());
  return isEasterDate(today);
};

export const isPride = () => {
  dayjs.extend(isSameOrAfter);
  dayjs.extend(isSameOrBefore);

  const prideStart = dayjs("2023-06-23");
  const prideEnd = dayjs("2023-07-01");
  const now = dayjs();
  return (
    now.isSameOrAfter(prideStart, "day") && now.isSameOrBefore(prideEnd, "day")
  );
};
