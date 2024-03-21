import { expect } from "chai";
import {
  isGjentakendeSykefravar,
  sortByDescendingStart,
} from "@/utils/oppfolgingstilfelleUtils";
import { generateOppfolgingstilfelle } from "../testDataUtils";
import { daysFromToday } from "../testUtils";
import { THREE_YEARS_AGO_IN_MONTHS } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import dayjs from "dayjs";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { VIRKSOMHET_BRANNOGBIL } from "../../mock/common/mockConstants";

describe("OppfolgingstilfelleUtils", () => {
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

    it("is NOT a gjentakende sykefravar if 5 short, less than 3 days, sykefravar and one long adding up to more than 100 days", () => {
      const tilfeller = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-400)),
        generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-299)),
        generateOppfolgingstilfelle(daysFromToday(-250), daysFromToday(-249)),
        generateOppfolgingstilfelle(daysFromToday(-200), daysFromToday(-199)),
        generateOppfolgingstilfelle(daysFromToday(-150), daysFromToday(-149)),
        generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(-99)),
      ];

      expect(isGjentakendeSykefravar(tilfeller)).to.be.false;
    });

    it("is a gjentakende sykefravar if 5 almost short, exactly 3 days, sykefravar and one long adding up to more than 100 days", () => {
      const tilfeller = [
        generateOppfolgingstilfelle(daysFromToday(-500), daysFromToday(-400)),
        generateOppfolgingstilfelle(daysFromToday(-300), daysFromToday(-298)),
        generateOppfolgingstilfelle(daysFromToday(-250), daysFromToday(-248)),
        generateOppfolgingstilfelle(daysFromToday(-200), daysFromToday(-198)),
        generateOppfolgingstilfelle(daysFromToday(-150), daysFromToday(-148)),
        generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(-98)),
      ];

      expect(isGjentakendeSykefravar(tilfeller)).to.be.true;
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

  describe("sortByDescendingStart", () => {
    it("return empty list if input is empty", () => {
      const tilfeller: OppfolgingstilfelleDTO[] = [];

      const sortedTilfeller = sortByDescendingStart(tilfeller);

      expect(sortedTilfeller.length).to.be.equal(0);
    });

    it("return list with tilfelle with latest start first", () => {
      const earliestStart = new Date("2023-01-01");
      const latestStart = new Date("2023-02-02");
      const tilfeller: OppfolgingstilfelleDTO[] = [
        {
          arbeidstakerAtTilfelleEnd: true,
          start: earliestStart,
          end: new Date("2023-02-01"),
          antallSykedager: 32,
          varighetUker: 4,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
        {
          arbeidstakerAtTilfelleEnd: true,
          start: latestStart,
          end: new Date("2023-03-01"),
          antallSykedager: 28,
          varighetUker: 8,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
      ];

      const sortedTilfeller = sortByDescendingStart(tilfeller);

      expect(sortedTilfeller[0].start).to.be.equal(latestStart);
    });

    it("return list with tilfelle with latest end first if both tilfeller start at the same date", () => {
      const start = new Date("2023-01-01");
      const earliestEnd = new Date("2023-02-01");
      const earliestVarighet = 4;
      const latestEnd = new Date("2023-03-02");
      const latestVarighet = 8;
      const tilfeller: OppfolgingstilfelleDTO[] = [
        {
          arbeidstakerAtTilfelleEnd: true,
          start: start,
          end: latestEnd,
          antallSykedager: 61,
          varighetUker: latestVarighet,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
        {
          arbeidstakerAtTilfelleEnd: true,
          start: start,
          end: earliestEnd,
          antallSykedager: 32,
          varighetUker: earliestVarighet,
          virksomhetsnummerList: [VIRKSOMHET_BRANNOGBIL.virksomhetsnummer],
        },
      ];

      const sortedTilfeller = sortByDescendingStart(tilfeller);

      expect(sortedTilfeller[0].end).to.be.equal(latestEnd);
    });
  });
});
