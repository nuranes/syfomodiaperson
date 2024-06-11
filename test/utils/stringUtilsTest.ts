import { expect, describe, it } from "vitest";
import { capitalizeAllWords } from "@/utils/stringUtils";

const expectedCapitalized = "Stevie Ray Vaughan";
const expectedCapitalizedHyphen = "Jean-Luc Picard";

describe("stringUtils", () => {
  it("skal gi alle ord stod forbokstav", () => {
    const name = "stevie ray vaughan";
    expect(capitalizeAllWords(name)).to.equal(expectedCapitalized);
  });

  it("skal håndtere bindestrek", () => {
    const name = "Jean-luc Picard";
    expect(capitalizeAllWords(name)).to.equal(expectedCapitalizedHyphen);
  });
});
