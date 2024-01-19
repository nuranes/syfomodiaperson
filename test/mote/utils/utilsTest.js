import { expect } from "chai";
import sinon from "sinon";
import { genererDato } from "@/sider/mote/utils";

describe("utils", () => {
  let clock;

  describe("genererDato", () => {
    beforeEach(() => {
      const today = new Date("2017-05-31");
      clock = sinon.useFakeTimers(today.getTime());
    });
    afterEach(() => {
      clock.restore();
    });

    it("31. Mai 10.00 blir riktig", () => {
      const s = genererDato("2017-05-31", "10:00");
      expect(s).to.equal("2017-05-31T10:00:00");
    });

    it("31. Mai 10.00 blir riktig", () => {
      const s = genererDato("2017-06-16", "10:00");
      expect(s).to.equal("2017-06-16T10:00:00");
    });
  });
});
