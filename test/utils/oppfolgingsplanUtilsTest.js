import dayjs from "dayjs";
import { expect, describe, it } from "vitest";
import { lpsPlanerWithActiveTilfelle } from "@/utils/oppfolgingsplanUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";

describe("oppfolgingsplanUtils", () => {
  describe("lpsPlanerWithActiveTilfelle", () => {
    const today = new Date();
    const defaultLpsplan = {
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      opprettet: dayjs(today).subtract(1, "days").toJSON(),
      sistEndret: dayjs(today).subtract(1, "days").toJSON(),
    };

    it("should return 1 plan if inside an active tilfelle", () => {
      const planer = [defaultLpsplan];
      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        dayjs(today).subtract(10, "days").toDate()
      );

      expect(activePlaner.length).to.be.equal(1);
    });

    it("should return an empty list if plan is before active tilfelle", () => {
      const tilfelleFom = dayjs(today).subtract(1, "days");

      const lpsPlanWithOpprettetBeforeTilfelleFom = {
        ...defaultLpsplan,
        opprettet: dayjs(tilfelleFom).subtract(5, "days"),
      };

      const planer = [lpsPlanWithOpprettetBeforeTilfelleFom];

      const activePlaner = lpsPlanerWithActiveTilfelle(planer, tilfelleFom);

      expect(activePlaner.length).to.be.equal(0);
    });

    it("should return an empty list if tilfelle is not active, even if plan was sent within that tilfelle", () => {
      const tilfelleFom = dayjs(today).subtract(10, "days");

      const lpsPlanWithinOldTilfelle = {
        ...defaultLpsplan,
        opprettet: dayjs(tilfelleFom).subtract(5, "days"),
      };

      const planer = [lpsPlanWithinOldTilfelle];

      const activePlaner = lpsPlanerWithActiveTilfelle(planer, tilfelleFom);

      expect(activePlaner.length).to.be.equal(0);
    });

    it("should return newest plan if more than one is sent in active tilfelle", () => {
      const tilfelleFom = dayjs(today).subtract(10, "days");

      const oldestLpsPlan = {
        ...defaultLpsplan,
        uuid: "old",
        opprettet: dayjs(tilfelleFom).subtract(9, "days"),
      };

      const newestLpsPlan = {
        ...defaultLpsplan,
        uuid: "new",
      };

      const planer = [oldestLpsPlan, newestLpsPlan];

      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        dayjs(today).subtract(10, "days").toDate()
      );

      expect(activePlaner.length).to.be.equal(1);
      expect(activePlaner[0]).to.deep.equal(newestLpsPlan);
    });

    it("should return 2 planer for different virksomheter if both are within combined tilfelle", () => {
      const plan1 = {
        ...defaultLpsplan,
      };

      const plan2 = {
        ...defaultLpsplan,
        virksomhetsnummer: "123456789",
      };

      const planer = [plan1, plan2];

      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        dayjs(today).subtract(10, "days").toDate()
      );

      expect(activePlaner.length).to.be.equal(2);
      expect(activePlaner[0].virksomhetsnummer).to.be.not.equal(
        activePlaner[1].virksomhetsnummer
      );
    });

    it("should return plan if sent within newest active tilfelle, even if there's no tilfelle for the plans virksomhet", () => {
      const activePlanFromRandomVirksomhet = {
        ...defaultLpsplan,
        virksomhetsnummer: "gibberish",
      };

      const planer = [activePlanFromRandomVirksomhet];

      const activePlaner = lpsPlanerWithActiveTilfelle(
        planer,
        dayjs(today).subtract(10, "days").toDate()
      );

      expect(activePlaner.length).to.be.equal(1);
      expect(activePlaner[0]).to.deep.equal(activePlanFromRandomVirksomhet);
    });
  });
});
