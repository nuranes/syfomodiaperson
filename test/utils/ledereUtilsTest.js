import { expect, describe, it, beforeEach, afterEach } from "vitest";
import sinon from "sinon";
import {
  ledereIVirksomheterMedMotebehovsvarFraArbeidstaker,
  ledereMedOppfolgingstilfelleInnenforMotebehovperioden,
  ledereUtenMotebehovsvar,
  ledereIVirksomheterDerIngenLederHarSvartPaMotebehov,
  lederHasActiveSykmelding,
  ledereWithActiveLedereFirst,
  virksomheterWithoutLeder,
  ledereSortertPaaNavnOgOrganisasjonsnavn,
} from "@/utils/ledereUtils";
import { ANTALL_MS_DAG } from "@/utils/datoUtils";
import {
  mockActiveSykmeldingForLeder,
  mockInactiveSykmeldingForLeder,
  mockLederWithActiveSykmelding,
  mockLederWithoutActiveSykmelding,
  mockSykmeldingWithStatusNyForLeder,
} from "../mockdata/mockLedere";
import { NarmesteLederRelasjonStatus } from "@/data/leder/ledereTypes";

describe("ledereUtils", () => {
  describe("ledereIVirksomheterMedMotebehovsvarFraArbeidstaker", () => {
    it("skal finne alle ledere som hører til en bedrift den sykmeldte har sendt inn møtebehovsvar for", () => {
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
        },
        {
          virksomhetsnummer: "321",
          narmesteLederPersonIdentNumber: "2",
        },
        {
          virksomhetsnummer: "999",
          narmesteLederPersonIdentNumber: "3",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "999",
        },
      ];

      const filtrertLederListe =
        ledereIVirksomheterMedMotebehovsvarFraArbeidstaker(
          ledere,
          motebehovData
        );

      expect(filtrertLederListe.length).to.equal(2);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("123");
      expect(filtrertLederListe[1].virksomhetsnummer).to.equal("999");
    });
  });
  describe("ledereIVirksomheterDerIngenLederHarSvartPaMotebehov", () => {
    it("skal fjerne ledere med innsendt møtebehov fra lederlisten", () => {
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
        },
        {
          virksomhetsnummer: "321",
          narmesteLederPersonIdentNumber: "2",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "1",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe =
        ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
          ledere,
          motebehovData
        );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("321");
    });
    it("skal fjerne ledere for virksomheter hvor minst én leder har innsendt møtebehov, fra lederlisten", () => {
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
          aktivFom: "2020-01-01",
        },
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "2",
          aktivFom: "2020-09-01",
        },
        {
          virksomhetsnummer: "321",
          narmesteLederPersonIdentNumber: "3",
          aktivFom: "2020-01-01",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "1",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe =
        ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
          ledere,
          motebehovData
        );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("321");
    });
    it("skal returnere en liste med alle ledere for en virksomhet hvis kun sykmeldt har svart på møtebehov", () => {
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
          aktivFom: "2020-01-01",
        },
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "2",
          aktivFom: "2020-09-01",
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe =
        ledereIVirksomheterDerIngenLederHarSvartPaMotebehov(
          ledere,
          motebehovData
        );

      expect(filtrertLederListe.length).to.equal(2);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("123");
      expect(filtrertLederListe[1].virksomhetsnummer).to.equal("123");
    });
  });
  describe("ledereMedOppfolgingstilfelleInnenforMotebehovperioden", () => {
    it("skal fjerne ledere uten oppfølgingstilfelle innenfor møtebehovperioden", () => {
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
        },
        {
          virksomhetsnummer: "321",
          narmesteLederPersonIdentNumber: "2",
        },
      ];
      const oppfolgingstilfeller = [
        {
          arbeidstakerAtTilfelleEnd: true,
          start: new Date(Date.now() - ANTALL_MS_DAG * 142),
          end: new Date(Date.now() - ANTALL_MS_DAG * 140),
          virksomhetsnummerList: ["321"],
        },
        {
          arbeidstakerAtTilfelleEnd: true,
          start: new Date(Date.now() - ANTALL_MS_DAG * 120),
          end: new Date(Date.now() + ANTALL_MS_DAG * 15),
          virksomhetsnummerList: ["123"],
        },
      ];

      const filtrertLederListe =
        ledereMedOppfolgingstilfelleInnenforMotebehovperioden(
          ledere,
          oppfolgingstilfeller
        );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("123");
    });
  });
  describe("ledereUtenMotebehovsvar", () => {
    it("skal finne ledere som ikke har sendt inn møtebehov, men som er i møtebehovperioden", () => {
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
        {
          virksomhetsnummer: "321",
          narmesteLederPersonIdentNumber: "2",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
        {
          virksomhetsnummer: "999",
          narmesteLederPersonIdentNumber: "3",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
      ];
      const oppfolgingstilfeller = [
        {
          arbeidstakerAtTilfelleEnd: true,
          start: new Date(Date.now() - ANTALL_MS_DAG * 120),
          end: new Date(Date.now() + ANTALL_MS_DAG * 15),
          virksomhetsnummerList: ["123", "321", "999"],
        },
      ];

      const motebehovData = [
        {
          opprettetAv: "1",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereUtenMotebehovsvar(
        ledere,
        motebehovData,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("999");
    });
    it("skal finne ledere som ikke har sendt inn møtebehov men hadde muligheten, og SM svarte", () => {
      const oppfolgingstilfeller = [];
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
        {
          virksomhetsnummer: "321",
          narmesteLederPersonIdentNumber: "2",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
        {
          virksomhetsnummer: "999",
          narmesteLederPersonIdentNumber: "3",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "999",
        },
        {
          opprettetAv: "3",
          aktorId: "0",
          virksomhetsnummer: "999",
        },
      ];

      const filtrertLederListe = ledereUtenMotebehovsvar(
        ledere,
        motebehovData,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("123");
    });
    it("skal finne nyeste leder hvis flere tilhører en virksomhet hvor kun sykmeldt har svart", () => {
      const oppfolgingstilfeller = [];
      const ledere = [
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "1",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
        {
          virksomhetsnummer: "123",
          narmesteLederPersonIdentNumber: "2",
          aktivFom: "2020-09-30",
          status: NarmesteLederRelasjonStatus.INNMELDT_AKTIV,
        },
        {
          virksomhetsnummer: "999",
          narmesteLederPersonIdentNumber: "3",
          aktivFom: "2020-01-01",
          status: NarmesteLederRelasjonStatus.DEAKTIVERT,
        },
      ];
      const motebehovData = [
        {
          opprettetAv: "0",
          aktorId: "0",
          virksomhetsnummer: "123",
        },
      ];

      const filtrertLederListe = ledereUtenMotebehovsvar(
        ledere,
        motebehovData,
        oppfolgingstilfeller
      );

      expect(filtrertLederListe.length).to.equal(1);
      expect(filtrertLederListe[0].virksomhetsnummer).to.equal("123");
      expect(filtrertLederListe[0].narmesteLederPersonIdentNumber).to.equal(
        "2"
      );
      expect(filtrertLederListe[0].aktivFom).to.equal("2020-09-30");
    });
  });

  describe("lederHasActiveSykmelding", () => {
    let clock;
    const today = new Date(Date.now());

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Returns true if there is an active sykmelding for leders virksomhet", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(true);
    });

    it("Returns false if sykmelding for leders virksomhet is not active", () => {
      const leder = mockLederWithoutActiveSykmelding;
      const sykmeldinger = [mockInactiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(false);
    });

    it("Returns false if there are no sykmeldinger for leders virksomhet", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockInactiveSykmeldingForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(false);
    });

    it("Returns false if sykmelding for leders virksomhet does not have status SENDT, regardless of acive dates", () => {
      const leder = mockLederWithActiveSykmelding;
      const sykmeldinger = [mockSykmeldingWithStatusNyForLeder];

      const hasActiveSykmelding = lederHasActiveSykmelding(
        leder.virksomhetsnummer,
        sykmeldinger
      );

      expect(hasActiveSykmelding).to.be.equal(false);
    });
  });

  describe("ledereWithActiveLedereFirst", () => {
    let clock;
    const today = new Date(Date.now());

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Returns a list where leder for virksomhet that has active sykmelding comes first", () => {
      const lederList = [
        mockLederWithoutActiveSykmelding,
        mockLederWithActiveSykmelding,
      ];
      const sykmeldinger = [
        mockActiveSykmeldingForLeder,
        mockInactiveSykmeldingForLeder,
      ];

      const sortedList = ledereWithActiveLedereFirst(lederList, sykmeldinger);

      expect(sortedList[0]).to.deep.equal(mockLederWithActiveSykmelding);
      expect(sortedList[1]).to.deep.equal(mockLederWithoutActiveSykmelding);
    });
  });

  describe("virksomheterWithoutLeder", () => {
    let clock;
    const today = new Date(Date.now());

    beforeEach(() => {
      clock = sinon.useFakeTimers(today.getTime());
    });

    afterEach(() => {
      clock.restore();
    });

    it("Returns a list with one leder if virksomhet in sykmelding does not have leder ", () => {
      const lederList = [mockLederWithoutActiveSykmelding];
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      const expectedLeder = {
        arbeidsgiverForskutterer: undefined,
        virksomhetsnummer:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.virksomhetsnummer,
        virksomhetsnavn:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.navn,
      };

      expect(ledereFromSykmeldinger.length).to.equal(1);
      expect(ledereFromSykmeldinger[0]).to.deep.equal(expectedLeder);
    });

    it("Returns empty list if there are no sykmeldinger", () => {
      const lederList = [];
      const sykmeldinger = [];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      expect(ledereFromSykmeldinger.length).to.be.equal(0);
    });

    it("Returns empty list if virksomhet in sykmeldinger has leder", () => {
      const lederList = [mockLederWithActiveSykmelding];
      const sykmeldinger = [mockActiveSykmeldingForLeder];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      expect(ledereFromSykmeldinger.length).to.be.equal(0);
    });

    it("Returns only one leder even if there are more than one active sykmelding for virksomhet without leder", () => {
      const lederList = [mockLederWithoutActiveSykmelding];
      const sykmeldinger = [
        mockActiveSykmeldingForLeder,
        mockActiveSykmeldingForLeder,
      ];

      const ledereFromSykmeldinger = virksomheterWithoutLeder(
        lederList,
        sykmeldinger
      );

      const expectedLeder = {
        arbeidsgiverForskutterer: undefined,
        virksomhetsnummer:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.virksomhetsnummer,
        virksomhetsnavn:
          mockActiveSykmeldingForLeder.mottakendeArbeidsgiver.navn,
      };

      expect(ledereFromSykmeldinger.length).to.equal(1);
      expect(ledereFromSykmeldinger[0]).to.deep.equal(expectedLeder);
    });
  });

  describe("ledereSortertPaaNavnOgOrganisasjonsnavn", () => {
    it("sorterer ledere etter organisasjonsnavn og deretter navn", () => {
      const leder1 = {
        narmesteLederNavn: "Per",
        virksomhetsnavn: "The Syndicate",
      };
      const leder2 = {
        narmesteLederNavn: "Carl",
        virksomhetsnavn: "The Syndicate",
      };
      const leder3 = {
        narmesteLederNavn: "John",
        virksomhetsnavn: "FBI",
      };
      const ledere = [leder1, leder2, leder3];
      const ledereSortert = ledereSortertPaaNavnOgOrganisasjonsnavn(ledere);
      expect(ledereSortert.length).to.equal(3);
      expect(ledereSortert[0]).to.deep.equal(leder3);
      expect(ledereSortert[1]).to.deep.equal(leder2);
      expect(ledereSortert[2]).to.deep.equal(leder1);
    });
  });
});
