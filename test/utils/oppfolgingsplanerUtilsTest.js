import { expect, describe, it, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import {
  mockAvbruttActiveOppfolgingsplan,
  mockAvbruttInactiveOppfolgingsplan,
  mockValidActiveOppfolgingsplan,
  mockValidActiveOppfolgingsplanWithDifferentVirksomhet,
} from "../mockdata/mockOppfolgingsplaner";
import {
  activeLPSOppfolgingsplaner,
  activeOppfolgingsplaner,
  toOppfolgingsplanLPSMedPersonoppgave,
} from "@/utils/oppfolgingsplanerUtils";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../../mock/common/mockConstants";

describe("oppfolgingsplanerUtils", () => {
  let clock;
  const today = new Date(Date.now());

  beforeEach(() => {
    clock = sinon.useFakeTimers(today.getTime());
  });

  afterEach(() => {
    clock.restore();
  });

  describe("activeOppfolgingsplaner", () => {
    it("Gives a list of one plan, when one is active", () => {
      const planer = [mockValidActiveOppfolgingsplan];

      const actualPlaner = activeOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(planer.length);
      expect(actualPlaner[0]).to.deep.equal(planer[0]);
    });

    it("Gives a list of one plan, when one is active and avbrutt", () => {
      const planer = [mockAvbruttActiveOppfolgingsplan];

      const actualPlaner = activeOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(planer.length);
      expect(actualPlaner[0]).to.deep.equal(planer[0]);
    });

    it("Gives empty list if all plans are invalid", () => {
      const planer = [mockAvbruttInactiveOppfolgingsplan];

      const actualPlaner = activeOppfolgingsplaner(planer);
      expect(actualPlaner.length).to.be.equal(0);
    });

    it("Gives two plans if the are from different virksomheter", () => {
      const planer = [
        mockValidActiveOppfolgingsplanWithDifferentVirksomhet,
        mockValidActiveOppfolgingsplan,
      ];

      const actualPlaner = activeOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(planer.length);
      expect(actualPlaner[0]).to.deep.equal(planer[0]);
      expect(actualPlaner[1]).to.deep.equal(planer[1]);
    });

    it("Gives the plan shared latest, if more than one from a virksomhet", () => {
      const planer = [
        mockAvbruttActiveOppfolgingsplan,
        mockValidActiveOppfolgingsplan,
      ];

      const expectedPlan = mockValidActiveOppfolgingsplan;

      const actualPlaner = activeOppfolgingsplaner(planer);

      expect(actualPlaner.length).to.be.equal(1);
      expect(actualPlaner[0]).to.deep.equal(expectedPlan);
    });
  });

  describe("activeLPSOppfolgingsplaner", () => {
    it("Gives the plan created last, if more than one from a virksomhet", () => {
      const planOne = {
        uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: new Date(),
      };
      const planMedPersonoppgaveOne = toOppfolgingsplanLPSMedPersonoppgave(
        planOne,
        []
      );

      const planTwo = {
        uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
        fnr: ARBEIDSTAKER_DEFAULT.personIdent,
        virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        opprettet: new Date() - 3600000 * 24,
      };
      const planMedPersonoppgaveTwo = toOppfolgingsplanLPSMedPersonoppgave(
        planTwo,
        []
      );

      const planer = [planMedPersonoppgaveOne, planMedPersonoppgaveTwo];

      const aktiveLPSPlaner = activeLPSOppfolgingsplaner(planer);

      expect(aktiveLPSPlaner.length).to.be.equal(1);
      expect(aktiveLPSPlaner[0]).to.deep.equal(planMedPersonoppgaveOne);
    });
  });
});
