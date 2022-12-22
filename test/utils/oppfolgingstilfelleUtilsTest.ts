import { expect } from "chai";
import { isGjentakendeSykefravar } from "@/utils/oppfolgingstilfelleUtils";
import { generateOppfolgingstilfelle } from "../aktivitetskrav/testDataUtils";
import { daysFromToday } from "../testUtils";
import { THREE_YEARS_AGO_IN_MONTHS } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import dayjs from "dayjs";

describe("isGjentakendeSykefravar", () => {
  it("is a gjentakende sykefravar if sick twice adding up to more than 400 days", () => {
    const tilfeller = [
      generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
      generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
    ];

    expect(isGjentakendeSykefravar(tilfeller)).to.be.true;
  });

  it("is NOT a gjentakende sykefravar if sick once for more than 400 days ", () => {
    const tilfeller = [
      generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-100)),
    ];

    expect(isGjentakendeSykefravar(tilfeller)).to.be.false;
  });

  it("is NOT a gjentakende sykefravar if 5 short sykefravar and one long adding up to more than 100 days", () => {
    const tilfeller = [
      generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-400)),
      generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-298)),
      generateOppfolgingstilfelle(daysFromToday(-250), daysFromToday(-248)),
      generateOppfolgingstilfelle(daysFromToday(-200), daysFromToday(-198)),
      generateOppfolgingstilfelle(daysFromToday(-150), daysFromToday(-148)),
      generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(-98)),
    ];

    expect(isGjentakendeSykefravar(tilfeller)).to.be.false;
  });

  it("is a gjentakende sykefravar if 5 sykefravar adding up to 101 days", () => {
    const tilfeller = [
      generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-481)),
      generateOppfolgingstilfelle(daysFromToday(-450), daysFromToday(-431)),
      generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-381)),
      generateOppfolgingstilfelle(daysFromToday(-350), daysFromToday(-331)),
      generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-280)),
    ];

    expect(isGjentakendeSykefravar(tilfeller)).to.be.true;
  });

  it("is NOT a gjentakende sykefravar if sick twice adding up to more than 400 days and one is old", () => {
    const threeYearsAgo = dayjs(new Date())
      .subtract(THREE_YEARS_AGO_IN_MONTHS, "month")
      .subtract(1, "day")
      .toDate();
    const threeYearsMinus200Days = dayjs(threeYearsAgo)
      .subtract(200, "day")
      .toDate();
    const tilfeller = [
      generateOppfolgingstilfelle(threeYearsMinus200Days, threeYearsAgo),
      generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
    ];

    expect(isGjentakendeSykefravar(tilfeller)).to.be.false;
  });

  it("is a gjentakende sykefravar if tilfelle ends less than three years ago", () => {
    const FIVE_YEARS_AGO_IN_MONTHS = 60;
    const fiveYearsAgo = dayjs(new Date())
      .subtract(FIVE_YEARS_AGO_IN_MONTHS, "month")
      .toDate();
    const lessThanThreeYearsAgo = dayjs(new Date())
      .subtract(THREE_YEARS_AGO_IN_MONTHS, "month")
      .add(1, "day")
      .toDate();
    const tilfeller = [
      generateOppfolgingstilfelle(fiveYearsAgo, lessThanThreeYearsAgo),
      generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
    ];

    expect(isGjentakendeSykefravar(tilfeller)).to.be.true;
  });
});
