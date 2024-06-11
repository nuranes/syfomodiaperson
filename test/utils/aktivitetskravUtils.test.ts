import { oppfolgingstilfelleForAktivitetskrav } from "@/utils/aktivitetskravUtils";
import {
  createAktivitetskrav,
  generateOppfolgingstilfelle,
} from "../testDataUtils";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { daysFromToday } from "../testUtils";
import { expect, describe, it } from "vitest";

describe("aktivitetskravUtils", () => {
  describe("oppfolgingstilfelleForAktivitetskrav", () => {
    it("returns oppfolgingstilfelle starting before stoppunkt and ending after stoppunkt for aktivitetskrav", () => {
      const aktivitetskrav = createAktivitetskrav(
        new Date(),
        AktivitetskravStatus.NY
      );
      const tilfeller = [
        generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
        generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(100)),
      ];

      const oppfolgingstilfelleDTO = oppfolgingstilfelleForAktivitetskrav(
        aktivitetskrav,
        tilfeller
      );
      expect(oppfolgingstilfelleDTO).to.not.be.undefined;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(oppfolgingstilfelleDTO!.start < aktivitetskrav.stoppunktAt).to.be
        .true;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(oppfolgingstilfelleDTO!.end >= aktivitetskrav.stoppunktAt).to.be
        .true;
    });
    it("returns undefined when no oppfolgingstilfelle starting before stoppunkt and ending after stoppunkt for aktivitetskrav", () => {
      const aktivitetskrav = createAktivitetskrav(
        new Date(),
        AktivitetskravStatus.NY
      );
      const tilfeller = [
        generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
      ];

      const oppfolgingstilfelleDTO = oppfolgingstilfelleForAktivitetskrav(
        aktivitetskrav,
        tilfeller
      );
      expect(oppfolgingstilfelleDTO).to.be.undefined;
    });
    it("returns undefined when no oppfolgingstilfeller", () => {
      const aktivitetskrav = createAktivitetskrav(
        new Date(),
        AktivitetskravStatus.NY
      );
      const tilfeller = [];

      const oppfolgingstilfelleDTO = oppfolgingstilfelleForAktivitetskrav(
        aktivitetskrav,
        tilfeller
      );
      expect(oppfolgingstilfelleDTO).to.be.undefined;
    });
  });
});
