import { expect, describe, it } from "vitest";
import { genererDato } from "@/sider/dialogmoter/utils";

describe("utils", () => {
  describe("genererDato", () => {
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
