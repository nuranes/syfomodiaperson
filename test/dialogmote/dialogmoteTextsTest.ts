import { expect, describe, it } from "vitest";
import {
  getReferatTexts,
  StandardtekstKey,
} from "@/data/dialogmote/dialogmoteTexts";
import { Malform } from "@/context/malform/MalformContext";

const expectedStandardtekstKeys = [
  "IKKE_BEHOV",
  "FRISKMELDING_ARBEIDSFORMIDLING",
  "AVKLARING_ARBEIDSEVNE",
  "OPPFOLGINGSTILTAK",
  "ARBEIDSRETTET_REHABILITERING",
  "OPPLAERING_UTDANNING",
  "UNNTAK_ARBEIDSGIVERPERIODE",
  "REISETILSKUDD",
  "HJELPEMIDLER_TILRETTELEGGING",
  "MIDLERTIDIG_LONNSTILSKUDD",
  "OKONOMISK_STOTTE",
  "INGEN_RETTIGHETER",
  "EKSPERTBISTAND",
];

describe("dialogmoteTexts", () => {
  it("inneholder forventede standardtekst-nøkler", () => {
    expect(Object.values(StandardtekstKey)).to.deep.equal(
      expectedStandardtekstKeys,
      "har ikke forventede standardtekst-nøkler"
    );
  });

  it("referattekster har tekster for alle standardtekst-nøkler", () => {
    [Malform.BOKMAL, Malform.NYNORSK].forEach((malform) => {
      expectedStandardtekstKeys.forEach((key) => {
        expect(
          getReferatTexts(malform).standardTekster.some(
            (standardTekst) => standardTekst.key === key
          ),
          `mangler ${malform} standardtekst for nøkkel ${key}`
        ).to.be.true;
      });
    });
  });
});
