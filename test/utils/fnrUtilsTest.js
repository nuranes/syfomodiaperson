import { expect, describe, it, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import { KJOENN } from "@/konstanter";
import {
  hentBrukersFoedseldatoFraFnr,
  hentBrukersAlderFraFnr,
  hentBrukersKjoennFraFnr,
  formaterFnr,
} from "@/utils/fnrUtils";

describe("fnrUtils", () => {
  describe("hentBrukersFoedseldatoFraFnr", () => {
    const assertLik = (verdi, resultat) => {
      expect(hentBrukersFoedseldatoFraFnr(verdi).getTime()).to.equal(
        resultat.getTime()
      );
    };
    const assertUndefined = (verdi) => {
      expect(hentBrukersFoedseldatoFraFnr(verdi)).to.equal(undefined);
    };

    it("Skal returnere undefined, med gyldig foedselsnummer, men ugyldig individsifre", () => {
      assertUndefined("14018089988");
    });

    it("Skal returnere rett foedselsdato, med gyldig D-nummer", () => {
      const foedselsdato = new Date("1980-01-14");
      assertLik("54018010088", foedselsdato);
    });

    it("Skal returnere rett foedselsdato, med gyldig H-nummer", () => {
      const foedselsdato = new Date("1980-01-14");
      assertLik("14418010088", foedselsdato);
    });

    describe("Personer foedt [1900-1999], med individsifre:[000, 499]", () => {
      const foedselsdato = new Date("1980-01-14");
      it("Skal returnere rett foedselsdato, for individsifre 000", () => {
        assertLik("14018000088", foedselsdato);
      });

      it("Skal returnere rett foedselsdato, for individsifre 499", () => {
        assertLik("14018049988", foedselsdato);
      });
    });

    describe("Personer foedt [1855-1899], med individsifre:[500, 749]", () => {
      const foedselsdato = new Date("1880-01-14");
      it("Skal returnere rett foedselsdato, for individsifre 500", () => {
        assertLik("14018050088", foedselsdato);
      });

      it("Skal returnere rett foedselsdato, for individsifre 749", () => {
        assertLik("14018074988", foedselsdato);
      });
    });

    describe("Personer foedt [2000-2039], med individsifre:[500, 999]", () => {
      const foedselsdato = new Date("2000-01-14");
      it("Skal returnere rett foedselsdato, for individsifre 500", () => {
        assertLik("14010050088", foedselsdato);
      });

      it("Skal returnere rett foedselsdato, for individsifre 749", () => {
        assertLik("14010074988", foedselsdato);
      });

      it("Skal returnere rett foedselsdato, for individsifre 999", () => {
        assertLik("14010099988", foedselsdato);
      });

      it("Skal returnere rett foedselsdato", () => {
        const foedselsdato = new Date("2039-01-14");
        assertLik("14013999988", foedselsdato);
      });
    });

    describe("Personer foedt [1940-1999], med individsifre:[900, 999]", () => {
      const foedselsdato = new Date("1940-01-14");
      it("Skal returnere rett foedselsdato, for individsifre 900", () => {
        assertLik("14014090088", foedselsdato);
      });

      it("Skal returnere rett foedselsdato, for individsifre 999", () => {
        assertLik("14014099988", foedselsdato);
      });
    });
  });

  describe("hentBrukersKjoennFraFnr", () => {
    it("Skal returnere kvinne, om 3. individsiffer er partall", () => {
      expect(hentBrukersKjoennFraFnr("01019900200")).to.equal(KJOENN.KVINNE);
    });

    it("Skal returnere mann, om 3. individsiffer er oddetall", () => {
      expect(hentBrukersKjoennFraFnr("01019900100")).to.equal(KJOENN.MANN);
    });
  });

  describe("hentBrukersAlderFraFnr", () => {
    let clock;
    let dagensDato;
    const today = new Date("2017-01-16");

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime()); // 16. januar 2017
      dagensDato = new Date();
    });

    afterEach(() => {
      clock.restore();
    });

    const foedselsaar = 1958;
    const hentFnrFraDato = (dato) => {
      let dag = dato.getDate().toString();
      dag = dag.length === 1 ? `0${dag}` : dag;
      let mnd = (dato.getMonth() + 1).toString();
      mnd = mnd.length === 1 ? `0${mnd}` : mnd;
      const aar = dato.getFullYear().toString().substring(2, 4);
      return `${dag + mnd + aar}33818`;
    };

    it("Skal returnere rett brukers alder, om bruker har hatt foedselsdag", () => {
      const foedselsDatoPassert = new Date();
      foedselsDatoPassert.setFullYear(foedselsaar);
      const fnrFoedselsDatoPassert = hentFnrFraDato(foedselsDatoPassert);
      const alder =
        dagensDato.getFullYear() - foedselsDatoPassert.getFullYear();

      expect(hentBrukersAlderFraFnr(fnrFoedselsDatoPassert)).to.equal(alder);
    });

    it("Skal returnere rett brukers alder, om bruker ikke har hatt foedselsdag", () => {
      const foedselsdatoIkkePassert = new Date();
      foedselsdatoIkkePassert.setFullYear(foedselsaar);
      foedselsdatoIkkePassert.setTime(
        foedselsdatoIkkePassert.getTime() + 24 * 60 * 60 * 1000
      );
      const fnrFoedselsDatoIkkePassert = hentFnrFraDato(
        foedselsdatoIkkePassert
      );
      const alder =
        dagensDato.getFullYear() - foedselsdatoIkkePassert.getFullYear() - 1;

      expect(hentBrukersAlderFraFnr(fnrFoedselsDatoIkkePassert)).to.equal(
        alder
      );
    });
  });

  describe("formaterFnr", () => {
    it("Skal formatere fnr", () => {
      const s = formaterFnr("12121233333");
      expect(s).to.equal("121212 33333");
    });
  });
});
