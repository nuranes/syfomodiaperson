import { expect } from "chai";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import sinon from "sinon";
import * as miljoutil from "@/utils/miljoUtil";
import { after } from "mocha";

describe("fnrValideringsUtils", () => {
  describe("erGyldigFodselsnummer in prod", () => {
    describe("valid cases", () => {
      it("return true if valid fnr", () => {
        const fnr = "15046600344";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.true;
      });

      it("return true if valid dnr", () => {
        const fnr = "57019149104";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.true;
      });

      it("return true if fnr is too long", () => {
        const fnr = "1504660034412345";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.true;
      });

      it("return true if valid NAV synthetic fnr in prod (Dette skjer fordi NAV-syntetisk blir likt som et H-nummer)", () => {
        const fnr = "15507600333";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.true;
      });
    });

    describe("invalid cases", () => {
      it("return false if no fnr provided", () => {
        const fnr = undefined;

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if fnr is too short", () => {
        const fnr = "1504660034";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if fnr isn't only digits", () => {
        const fnr = "150466003ab";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if fnr has invalid day", () => {
        const fnr = "95046600344";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if fnr has invalid month", () => {
        const fnr = "15146600344";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if invalid kontrollsiffer 1", () => {
        const fnr = "15046600354";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if invalid kontrollsiffer 2", () => {
        const fnr = "15046600345";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });

      it("return false if valid Skatteetaten fnr in prod", () => {
        const fnr = "17912099997";

        const isValidFnr = erGyldigFodselsnummer(fnr);

        expect(isValidFnr).to.be.false;
      });
    });
  });

  describe("erGyldigFodselsnummer in preprod", () => {
    const erPreProdStub = sinon.stub(miljoutil, "erPreProd");

    before((): void => {
      erPreProdStub.returns(true);
    });
    after((): void => {
      erPreProdStub.reset();
    });

    it("return true if valid NAV synthetic fnr (add 40 to month)", () => {
      const fnr = "15507600333";

      const isValidFnr = erGyldigFodselsnummer(fnr);

      expect(isValidFnr).to.be.true;
    });

    it("return true if valid NAV synthetic dnr (add 40 to month)", () => {
      const fnr = "55507608360";

      const isValidFnr = erGyldigFodselsnummer(fnr);

      expect(isValidFnr).to.be.true;
    });

    it("return true if valid Skatteetaten synthetic fnr (add 80 to month)", () => {
      const fnr = "17912099997";

      const isValidFnr = erGyldigFodselsnummer(fnr);

      expect(isValidFnr).to.be.true;
    });

    it("return true if valid Skatteetaten synthetic dnr (add 80 to month)", () => {
      const fnr = "57912075186";

      const isValidFnr = erGyldigFodselsnummer(fnr);

      expect(isValidFnr).to.be.true;
    });
  });
});
