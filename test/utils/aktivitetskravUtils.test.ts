import {
  aktivitetskravVurderingerForOppfolgingstilfelle,
  oppfolgingstilfelleForAktivitetskrav,
} from "@/utils/aktivitetskravUtils";
import {
  createAktivitetskrav,
  createAktivitetskravVurdering,
  generateOppfolgingstilfelle,
} from "../testDataUtils";
import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  OppfyltVurderingArsak,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { daysFromToday } from "../testUtils";
import { expect } from "chai";

describe("aktivitetskravUtils", () => {
  describe("aktivitetskravVurderingerForOppfolgingstilfelle", () => {
    it("returns vurderinger for all aktivitetskrav with stoppunkt after oppfolgingstilfelle start and before oppfolgingstilfelle end", () => {
      const oppfolgingstilfelle = generateOppfolgingstilfelle(
        daysFromToday(-100),
        daysFromToday(100)
      );
      const aktivitetskrav = [
        createAktivitetskrav(daysFromToday(-501), AktivitetskravStatus.UNNTAK, [
          createAktivitetskravVurdering(AktivitetskravStatus.UNNTAK, [
            UnntakVurderingArsak.SJOMENN_UTENRIKS,
          ]),
        ]),
        createAktivitetskrav(
          daysFromToday(-300),
          AktivitetskravStatus.AUTOMATISK_OPPFYLT
        ),
        createAktivitetskrav(new Date(), AktivitetskravStatus.OPPFYLT, [
          createAktivitetskravVurdering(AktivitetskravStatus.OPPFYLT, [
            OppfyltVurderingArsak.FRISKMELDT,
          ]),
          createAktivitetskravVurdering(AktivitetskravStatus.AVVENT, [
            AvventVurderingArsak.INFORMASJON_BEHANDLER,
          ]),
        ]),
      ];

      const aktivitetskravVurderinger =
        aktivitetskravVurderingerForOppfolgingstilfelle(
          aktivitetskrav,
          oppfolgingstilfelle
        );
      expect(aktivitetskravVurderinger).to.have.length(2);
      expect(aktivitetskravVurderinger[0].status).to.equal(
        AktivitetskravStatus.OPPFYLT
      );
      expect(aktivitetskravVurderinger[1].status).to.equal(
        AktivitetskravStatus.AVVENT
      );
    });
    it("returns no vurderinger when no aktivitetskrav with stoppunkt after oppfolgingstilfelle start and before oppfolgingstilfelle end", () => {
      const oppfolgingstilfelle = generateOppfolgingstilfelle(
        daysFromToday(-100),
        daysFromToday(100)
      );
      const aktivitetskrav = [
        createAktivitetskrav(daysFromToday(-501), AktivitetskravStatus.UNNTAK, [
          createAktivitetskravVurdering(AktivitetskravStatus.UNNTAK, [
            UnntakVurderingArsak.SJOMENN_UTENRIKS,
          ]),
        ]),
        createAktivitetskrav(
          daysFromToday(-300),
          AktivitetskravStatus.AUTOMATISK_OPPFYLT
        ),
      ];

      const aktivitetskravVurderinger =
        aktivitetskravVurderingerForOppfolgingstilfelle(
          aktivitetskrav,
          oppfolgingstilfelle
        );
      expect(aktivitetskravVurderinger).to.be.empty;
    });
  });
  describe("oppfolgingstilfelleForAktivitetskrav", () => {
    it("returns oppfolgingstilfelle starting before stoppunkt and ending after stoppunkt for aktivitetskrav", () => {
      const aktivitetskrav = createAktivitetskrav(
        new Date(),
        AktivitetskravStatus.NY
      );
      const tilfeller = [
        generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
        generateOppfolgingstilfelle(daysFromToday(-100), daysFromToday(100)),
      ];

      const oppfolgingstilfelleDTO = oppfolgingstilfelleForAktivitetskrav(
        aktivitetskrav,
        tilfeller
      );
      expect(oppfolgingstilfelleDTO).to.not.be.undefined;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(oppfolgingstilfelleDTO!.start < aktivitetskrav.stoppunktAt).to.be
        .true;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(oppfolgingstilfelleDTO!.end >= aktivitetskrav.stoppunktAt).to.be
        .true;
    });
    it("returns undefined when no oppfolgingstilfelle starting before stoppunkt and ending after stoppunkt for aktivitetskrav", () => {
      const aktivitetskrav = createAktivitetskrav(
        new Date(),
        AktivitetskravStatus.NY
      );
      const tilfeller = [
        generateOppfolgingstilfelle(daysFromToday(-601), daysFromToday(-401)),
        generateOppfolgingstilfelle(daysFromToday(-400), daysFromToday(-200)),
      ];

      const oppfolgingstilfelleDTO = oppfolgingstilfelleForAktivitetskrav(
        aktivitetskrav,
        tilfeller
      );
      expect(oppfolgingstilfelleDTO).to.be.undefined;
    });
    it("returns undefined when no oppfolgingstilfeller", () => {
      const aktivitetskrav = createAktivitetskrav(
        new Date(),
        AktivitetskravStatus.NY
      );
      const tilfeller = [];

      const oppfolgingstilfelleDTO = oppfolgingstilfelleForAktivitetskrav(
        aktivitetskrav,
        tilfeller
      );
      expect(oppfolgingstilfelleDTO).to.be.undefined;
    });
  });
});
