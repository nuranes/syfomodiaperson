import { expect, describe, it, afterEach } from "vitest";
import sinon from "sinon";
import { isEaster, isPride } from "@/utils/festiveUtils";

describe("festiveUtils", () => {
  let clock: any;
  let today: Date;

  afterEach(() => {
    clock.restore();
  });

  describe("isEaster", () => {
    it("wednesday before easter is not easter", () => {
      today = new Date("2022-04-06T00:59:59.999Z");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isEaster()).to.equal(false);
    });

    it("thursday before easter is easter", () => {
      today = new Date("2022-04-07T00:00:00.000Z");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isEaster()).to.equal(true);
    });

    it("easter monday is easter", () => {
      today = new Date("2022-04-18T00:59:59.999Z");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isEaster()).to.equal(true);
    });

    it("tuesday before easter is not easter", () => {
      today = new Date("2022-04-19T00:00:00.000Z");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isEaster()).to.equal(false);
    });
  });

  describe("isPride", () => {
    it("pride starts june 23", () => {
      today = new Date("2023-06-23");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isPride()).to.equal(true);
    });

    it("last day of pride is july 1", () => {
      today = new Date("2023-07-01");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isPride()).to.equal(true);
    });

    it("pride hasn't started june 22", () => {
      today = new Date("2023-06-22");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isPride()).to.equal(false);
    });

    it("no pride after july 1", () => {
      today = new Date("2023-07-02");
      clock = sinon.useFakeTimers(today.getTime());

      expect(isPride()).to.equal(false);
    });
  });
});
