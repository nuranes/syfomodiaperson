import { expect } from "chai";
import sinon from "sinon";
import { isEaster } from "@/utils/festiveUtils";

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
});
