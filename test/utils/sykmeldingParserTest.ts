import { expect, describe, it } from "vitest";
import { toDate } from "@/utils/datoUtils";
import {
  newSMFormat2OldFormat,
  oldFormatSMForAG,
} from "@/utils/sykmeldinger/sykmeldingParser";
import {
  mockOldSykmeldinger,
  mockSykmeldinger,
  mockSykmeldingId,
} from "../mockdata/sykmeldinger/mockSykmeldinger";
import {
  mockSykmeldingerWithBekreftelse,
  mockSykmeldingerWithEgenmeldt,
  mockSykmeldingerWithHarRedusertArbeidsgiverperiode,
  mockSykmeldingerWithPapirsykmelding,
  mockSykmeldingerWithUtdypendeOpplysningerPkt62,
  mockSykmeldingerWithUtdypendeOpplysningerPkt62SomeFieldsOmitted,
  mockSykmeldingerWithUtdypendeOpplysningerPkt63,
  mockSykmeldingWithArbeidsevne,
  mockSykmeldingWithArbeidsgiver,
  mockSykmeldingWithDiagnoseInfo,
  mockSykmeldingWithKontaktMedPasient,
  mockSykmeldingWithMeldingTilNav,
  mockSykmeldingWithMottakendeArbeidsgiver,
  mockSykmeldingWithoutMottakendeArbeidsgiver,
  mockSykmeldingWithPeriodeWithAktivitetIkkeMulig,
  mockSykmeldingWithPeriodeWithGradert,
  mockSykmeldingWithPrognoseErIArbeid,
  mockSykmeldingWithPrognoseErIkkeIArbeid,
  mockSykmeldingWithSporsmalOgSvarListe,
  mockSykmeldingWithStatus,
  mockSykmeldingWithTwoPerioder,
} from "../mockdata/sykmeldinger/mockSykmeldingExtraInfo";
import {
  GamleSykmeldingStatuser,
  NyeSykmeldingStatuser,
} from "@/utils/sykmeldinger/sykmeldingstatuser";
import { FriskmeldingDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { medisinskArsakTypeTekster } from "@/data/sykmelding/types/MedisinskArsakTypeDTO";
import { arbeidsrelatertArsakTypetekster } from "@/data/sykmelding/types/ArbeidsrelatertArsakTypeDTO";
import { VIRKSOMHET_PONTYPANDY } from "../../mock/common/mockConstants";

const sykmeldtFnr = "99887766554";

describe("sykmeldingParser", () => {
  describe("newSMFormat2OldFormat returns correct sykmelding when only required fields are given", () => {
    it("Return correct sykmelding", () => {
      const newSykmelding = mockSykmeldinger[0];
      const oldSykmelding = mockOldSykmeldinger[0];
      const outputSM = newSMFormat2OldFormat(newSykmelding, sykmeldtFnr);

      expect(outputSM).to.deep.equal(oldSykmelding);
    });
  });

  describe("arbeidsevne", () => {
    it("Return correct arbeidsevne", () => {
      const incomingSykmelding = mockSykmeldingWithArbeidsevne;

      const expectedSykmeldingArbeidsevne = {
        tilretteleggingArbeidsplass: "Tilrettelegging",
        tiltakAndre: "TiltakAndre",
        tiltakNAV: "TiltakAndre",
      };
      const outputSM = newSMFormat2OldFormat(incomingSykmelding, sykmeldtFnr);

      expect(outputSM.arbeidsevne).to.deep.equal(expectedSykmeldingArbeidsevne);
    });
  });

  describe("arbeidsgiver", () => {
    it("Return correct arbeidsgiver when we have info", () => {
      const incomingSykmeldingWithArbeidsgiver = mockSykmeldingWithArbeidsgiver;

      const expectedSykmeldingArbeidsgiver = "AG";

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithArbeidsgiver,
        sykmeldtFnr
      );

      expect(outputSM.arbeidsgiver).to.deep.equal(
        expectedSykmeldingArbeidsgiver
      );
    });

    it("Return correct arbeidsgiver without info", () => {
      const mockSM = mockSykmeldinger[0];
      const expectedSykmeldingArbeidsgiver = undefined;

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.arbeidsgiver).to.deep.equal(
        expectedSykmeldingArbeidsgiver
      );
    });
  });

  describe("bekreftelse", () => {
    it("Returns correct bekreftelse with info", () => {
      const incomingSykmeldingWithBekreftelseinfo =
        mockSykmeldingerWithBekreftelse;

      const expectedSykmeldingBekreftelse = {
        sykmelder: "Lego Las Legesen",
        sykmelderTlf: "12345678",
        utstedelsesdato: toDate("2020-01-21T22:00:00Z"),
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithBekreftelseinfo,
        sykmeldtFnr
      );

      expect(outputSM.bekreftelse).to.deep.equal(expectedSykmeldingBekreftelse);
    });

    it("Returns correct bekreftelse without info", () => {
      const mockSM = mockSykmeldinger[0];
      const expectedSykmeldingBekreftelse = {
        sykmelder: "Lego Legesen",
        sykmelderTlf: undefined,
        utstedelsesdato: toDate("2020-01-21T22:00:00Z"),
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.bekreftelse).to.deep.equal(expectedSykmeldingBekreftelse);
    });
  });

  describe("diagnose", () => {
    const incomingSykmeldingWithDiagnoseinfo = mockSykmeldingWithDiagnoseInfo;

    it("Returns correct diagnose with info", () => {
      const expectedSykmeldingDiagnose = {
        bidiagnoser: [
          {
            diagnose: "GANGLION SENE",
            diagnosekode: "L87",
            diagnosesystem: "ICPC-2",
          },
        ],
        fravaerBeskrivelse: "Annen Grunn",
        fravaersgrunnLovfestet: "GODKJENT_HELSEINSTITUSJON",
        hoveddiagnose: {
          diagnose: "TENDINITT INA",
          diagnosekode: "L87",
          diagnosesystem: "ICPC-2",
        },
        svangerskap: true,
        yrkesskade: true,
        yrkesskadeDato: toDate("2020-01-22"),
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithDiagnoseinfo,
        sykmeldtFnr
      );

      expect(outputSM.diagnose).to.deep.equal(expectedSykmeldingDiagnose);
    });

    it("Returns correct diagnose when skjermesForPasient is true", () => {
      const incomingSykmeldingWithSkjermetForPasient = {
        ...incomingSykmeldingWithDiagnoseinfo,
        skjermesForPasient: true,
      };
      const expectedSykmeldingDiagnose = {
        bidiagnoser: undefined,
        fravaerBeskrivelse: undefined,
        fravaersgrunnLovfestet: undefined,
        hoveddiagnose: undefined,
        svangerskap: true,
        yrkesskade: true,
        yrkesskadeDato: toDate("2020-01-22"),
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithSkjermetForPasient,
        sykmeldtFnr
      );

      expect(outputSM.diagnose).to.deep.equal(expectedSykmeldingDiagnose);
    });

    it("Returns correct diagnose without info", () => {
      const mockSM = mockSykmeldinger[0];
      const expectedSykmeldingDiagnose = {
        bidiagnoser: [],
        fravaerBeskrivelse: undefined,
        fravaersgrunnLovfestet: undefined,
        hoveddiagnose: {
          diagnose: undefined,
          diagnosekode: "tt",
          diagnosesystem: "tt",
        },
        svangerskap: false,
        yrkesskade: false,
        yrkesskadeDato: undefined,
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.diagnose).to.deep.equal(expectedSykmeldingDiagnose);
    });
  });

  describe("friskmelding", () => {
    it("Returns correct friskmelding with erIArbeid", () => {
      const incomingSykmeldingWithPrognoseErIArbeid =
        mockSykmeldingWithPrognoseErIArbeid;

      const expectedSykmeldingFriskmelding = {
        antarReturAnnenArbeidsgiver: true,
        antarReturSammeArbeidsgiver: true,
        antattDatoReturSammeArbeidsgiver: toDate("2020-01-22"),
        arbeidsfoerEtterPerioden: true,
        hensynPaaArbeidsplassen: "Hensyn",
        tilbakemeldingReturArbeid: toDate("2020-01-22"),
        utenArbeidsgiverAntarTilbakeIArbeid: undefined,
        utenArbeidsgiverAntarTilbakeIArbeidDato: undefined,
        utenArbeidsgiverTilbakemelding: undefined,
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithPrognoseErIArbeid,
        sykmeldtFnr
      );

      expect(outputSM.friskmelding).to.deep.equal(
        expectedSykmeldingFriskmelding
      );
    });

    it("Returns correct friskmelding with erIkkeIArbeid", () => {
      const incomingSykmeldingWithPrognoseErIkkeIArbeid =
        mockSykmeldingWithPrognoseErIkkeIArbeid;

      const expectedSykmeldingFriskmelding = {
        antarReturAnnenArbeidsgiver: undefined,
        antarReturSammeArbeidsgiver: undefined,
        antattDatoReturSammeArbeidsgiver: undefined,
        arbeidsfoerEtterPerioden: false,
        hensynPaaArbeidsplassen: "Hensyn",
        tilbakemeldingReturArbeid: undefined,
        utenArbeidsgiverAntarTilbakeIArbeid: true,
        utenArbeidsgiverAntarTilbakeIArbeidDato: toDate("2020-01-22"),
        utenArbeidsgiverTilbakemelding: toDate("2020-01-22"),
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithPrognoseErIkkeIArbeid,
        sykmeldtFnr
      );

      expect(outputSM.friskmelding).to.deep.equal(
        expectedSykmeldingFriskmelding
      );
    });

    it("Returns correct friskmelding without info", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedSykmeldingFriskmelding = {
        antarReturAnnenArbeidsgiver: undefined,
        antarReturSammeArbeidsgiver: undefined,
        antattDatoReturSammeArbeidsgiver: undefined,
        arbeidsfoerEtterPerioden: undefined,
        hensynPaaArbeidsplassen: undefined,
        tilbakemeldingReturArbeid: undefined,
        utenArbeidsgiverAntarTilbakeIArbeid: undefined,
        utenArbeidsgiverAntarTilbakeIArbeidDato: undefined,
        utenArbeidsgiverTilbakemelding: undefined,
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.friskmelding).to.deep.equal(
        expectedSykmeldingFriskmelding
      );
    });
  });

  describe("id", () => {
    it("Returns correct id", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedId = mockSykmeldingId;

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.id).to.deep.equal(expectedId);
    });
  });

  describe("identdato", () => {
    it("Returns undefined", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.identdato).to.deep.equal(undefined);
    });
  });

  describe("innsendtArbeidsgivernavn", () => {
    it("Returns correct innsendtArbeidsgivernavn", () => {
      const incomingSykmeldingWithMottakendeArbeidsgiver =
        mockSykmeldingWithMottakendeArbeidsgiver;

      const expectedInnsendtArbeidsgivernavn = "Bedrift";

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithMottakendeArbeidsgiver,
        sykmeldtFnr
      );

      expect(outputSM.innsendtArbeidsgivernavn).to.deep.equal(
        expectedInnsendtArbeidsgivernavn
      );
    });

    it("Returns correct innsendtArbeidsgivernavn withouth info", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedInnsendtArbeidsgivernavn =
        VIRKSOMHET_PONTYPANDY.virksomhetsnavn;

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.innsendtArbeidsgivernavn).to.deep.equal(
        expectedInnsendtArbeidsgivernavn
      );
    });
  });

  describe("innspillTilArbeidsgiver", () => {
    it("Returns correct innspillTilArbeidsgiver", () => {
      const mockSM = mockSykmeldinger[0];
      const incomingSykmeldingWithMeldingTilArbeidsgiver = {
        ...mockSM,
        meldingTilArbeidsgiver: "Melding",
      };

      const expectedInnspillTilArbeidsgiver = "Melding";

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithMeldingTilArbeidsgiver,
        sykmeldtFnr
      );

      expect(outputSM.innspillTilArbeidsgiver).to.deep.equal(
        expectedInnspillTilArbeidsgiver
      );
    });

    it("Returns correct innspillTilArbeidsgiver withouth info", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.innspillTilArbeidsgiver).to.deep.equal(undefined);
    });
  });

  describe("meldingTilNav", () => {
    it("Returns correct meldingTilNav", () => {
      const incomingSykmeldingWithMeldingTilNav =
        mockSykmeldingWithMeldingTilNav;

      const expectedmeldingTilNav = {
        navBoerTaTakISaken: true,
        navBoerTaTakISakenBegrunnelse: "Bistand",
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingWithMeldingTilNav,
        sykmeldtFnr
      );

      expect(outputSM.meldingTilNav).to.deep.equal(expectedmeldingTilNav);
    });

    it("Returns correct meldingTilNav withouth info", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedmeldingTilNav = {
        navBoerTaTakISaken: undefined,
        navBoerTaTakISakenBegrunnelse: undefined,
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.meldingTilNav).to.deep.equal(expectedmeldingTilNav);
    });
  });

  describe("mottakendeArbeidsgiver", () => {
    it("Returns correct mottakendeArbeidsgiver", () => {
      const sykmeldingWithMottakendeArbeidsgiver =
        mockSykmeldingWithMottakendeArbeidsgiver;

      const expectedMottakendeArbeidsgiver = {
        juridiskOrgnummer: "1234567",
        navn: "Bedrift",
        virksomhetsnummer: "7654321",
      };

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithMottakendeArbeidsgiver,
        sykmeldtFnr
      );

      expect(outputSM.mottakendeArbeidsgiver).to.deep.equal(
        expectedMottakendeArbeidsgiver
      );
    });

    it("Returns correct mottakendeArbeidsgiver withouth info", () => {
      const outputSM = newSMFormat2OldFormat(
        mockSykmeldingWithoutMottakendeArbeidsgiver,
        sykmeldtFnr
      );

      expect(outputSM.mottakendeArbeidsgiver).to.deep.equal(undefined);
    });
  });

  describe("mulighetForArbeid", () => {
    it("Returns correct mulighetForArbeid with aktivitetIkkeMulig", () => {
      const incomingSykmeldingPeriodeWithAktivitetIkkeMulig =
        mockSykmeldingWithPeriodeWithAktivitetIkkeMulig;

      const expectedMulighetForArbeid = {
        aarsakAktivitetIkkeMulig433: "Beskrivelse",
        aarsakAktivitetIkkeMulig434: "Beskrivelse2",
        aktivitetIkkeMulig433: [
          medisinskArsakTypeTekster.TILSTAND_HINDRER_AKTIVITET,
        ],
        aktivitetIkkeMulig434: [
          arbeidsrelatertArsakTypetekster.MANGLENDE_TILRETTELEGGING,
        ],
        perioder: [
          {
            avventende: undefined,
            behandlingsdager: undefined,
            fom: toDate("2020-01-22"),
            grad: 100,
            reisetilskudd: undefined,
            tom: toDate("2020-05-22"),
          },
        ],
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingPeriodeWithAktivitetIkkeMulig,
        sykmeldtFnr
      );

      expect(outputSM.mulighetForArbeid).to.deep.equal(
        expectedMulighetForArbeid
      );
    });

    it("Returns correct mulighetForArbeid with Gradert", () => {
      const incomingSykmeldingPeriodeWithGradert =
        mockSykmeldingWithPeriodeWithGradert;

      const expectedMulighetForArbeid = {
        aarsakAktivitetIkkeMulig433: undefined,
        aarsakAktivitetIkkeMulig434: undefined,
        aktivitetIkkeMulig433: undefined,
        aktivitetIkkeMulig434: undefined,
        perioder: [
          {
            avventende: undefined,
            behandlingsdager: undefined,
            fom: toDate("2020-01-22"),
            grad: 50,
            reisetilskudd: true,
            tom: toDate("2020-05-22"),
          },
        ],
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingPeriodeWithGradert,
        sykmeldtFnr
      );

      expect(outputSM.mulighetForArbeid).to.deep.equal(
        expectedMulighetForArbeid
      );
    });

    it("Returns correct mulighetForArbeid with more than one periode", () => {
      const incomingSykmeldingPeriodeWithGradert =
        mockSykmeldingWithTwoPerioder;

      const expectedMulighetForArbeid = {
        aarsakAktivitetIkkeMulig433: undefined,
        aarsakAktivitetIkkeMulig434: undefined,
        aktivitetIkkeMulig433: undefined,
        aktivitetIkkeMulig434: undefined,
        perioder: [
          {
            avventende: undefined,
            behandlingsdager: undefined,
            fom: toDate("2020-01-22"),
            grad: 100,
            reisetilskudd: undefined,
            tom: toDate("2020-05-22"),
          },
          {
            avventende: undefined,
            behandlingsdager: 2,
            fom: toDate("2020-02-17"),
            grad: undefined,
            reisetilskudd: undefined,
            tom: toDate("2020-03-01"),
          },
        ],
      };

      const outputSM = newSMFormat2OldFormat(
        incomingSykmeldingPeriodeWithGradert,
        sykmeldtFnr
      );

      expect(outputSM.mulighetForArbeid).to.deep.equal(
        expectedMulighetForArbeid
      );
    });
  });

  describe("orgnummer", () => {
    it("Returns correct orgnummer", () => {
      const sykmeldingWithMottakendeArbeidsgiver =
        mockSykmeldingWithMottakendeArbeidsgiver;

      const expectedMottakendeArbeidsgiver = "7654321";

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithMottakendeArbeidsgiver,
        sykmeldtFnr
      );

      expect(outputSM.orgnummer).to.deep.equal(expectedMottakendeArbeidsgiver);
    });
  });

  describe("pasient", () => {
    it("Returns correct pasient with only fnr", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedPasient = {
        etternavn: undefined,
        fnr: sykmeldtFnr,
        fornavn: undefined,
        mellomnavn: undefined,
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.pasient).to.deep.equal(expectedPasient);
    });
  });

  describe("sendtdato", () => {
    it("Returns correct sendtdato", () => {
      const sykmeldingWithStatusSendt = mockSykmeldinger[0];

      const expectedMottakendeArbeidsgiver =
        sykmeldingWithStatusSendt.sykmeldingStatus.timestamp;

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithStatusSendt,
        sykmeldtFnr
      );

      expect(outputSM.sendtdato).to.deep.equal(expectedMottakendeArbeidsgiver);
    });
  });

  describe("sporsmal", () => {
    it("Returns correct sporsmal", () => {
      const sykmeldingWithSporsmalOgSvarListe =
        mockSykmeldingWithSporsmalOgSvarListe();

      const expectedSporsmal = {
        arbeidssituasjon: "ARBEIDSTAKER",
        fravaersperioder: [
          {
            fom: "2020-02-24",
            tom: "2020-03-22",
          },
        ],
        harAnnetFravaer: true,
        harForsikring: false,
        egenmeldingsdager: [
          "2023-03-06",
          "2023-03-10",
          "2023-03-07",
          "2023-03-08",
          "2023-03-11",
        ],
      };

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithSporsmalOgSvarListe,
        sykmeldtFnr
      );

      expect(outputSM.sporsmal).to.deep.equal(expectedSporsmal);
    });

    it("Returns correct sporsmal without info", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedSporsmal = {
        arbeidssituasjon: undefined,
        fravaersperioder: [],
        harAnnetFravaer: false,
        harForsikring: false,
        egenmeldingsdager: [],
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.sporsmal).to.deep.equal(expectedSporsmal);
    });
  });

  describe("status", () => {
    it("Returns correct status", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.status).to.deep.equal(GamleSykmeldingStatuser.SENDT);
    });

    it("Returns correct status when status is APEN", () => {
      const sykmeldingWithStatusApen = mockSykmeldingWithStatus(
        NyeSykmeldingStatuser.APEN
      );

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithStatusApen,
        sykmeldtFnr
      );

      expect(outputSM.status).to.deep.equal(GamleSykmeldingStatuser.NY);
    });

    it("Returns correct status when status is UTGATT", () => {
      const sykmeldingWithStatusApen = mockSykmeldingWithStatus(
        NyeSykmeldingStatuser.UTGATT
      );

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithStatusApen,
        sykmeldtFnr
      );

      expect(outputSM.status).to.deep.equal(GamleSykmeldingStatuser.UTGAATT);
    });
  });

  describe("tilbakedatering", () => {
    it("Returns correct tilbakedatering", () => {
      const sykmeldingWithKontaktMedPasient =
        mockSykmeldingWithKontaktMedPasient;

      const expectedTilbakedatering = {
        dokumenterbarPasientkontakt: toDate("2020-02-02T02:02:02.202Z"),
        tilbakedatertBegrunnelse: "Ikke kontakt",
      };

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithKontaktMedPasient,
        sykmeldtFnr
      );

      expect(outputSM.tilbakedatering).to.deep.equal(expectedTilbakedatering);
    });

    it("Returns correct tilbakedatering without info", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedSporsmal = {
        dokumenterbarPasientkontakt: undefined,
        tilbakedatertBegrunnelse: undefined,
      };

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.tilbakedatering).to.deep.equal(expectedSporsmal);
    });
  });

  describe("utdypendeOpplysninger", () => {
    it("Returns correct utdypendeOpplysninger with utdypende opplysninger pkt. 6.2", () => {
      const sykmeldingWithUtdypendeOpplysningerPkt62 =
        mockSykmeldingerWithUtdypendeOpplysningerPkt62();

      const expectedUtdypendeOpplysninger =
        sykmeldingWithUtdypendeOpplysningerPkt62.utdypendeOpplysninger;

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithUtdypendeOpplysningerPkt62,
        sykmeldtFnr
      );

      expect(outputSM.utdypendeOpplysninger).to.deep.equal(
        expectedUtdypendeOpplysninger
      );
    });

    it("Returns correct utdypendeOpplysninger with utdypende opplysninger pkt. 6.3", () => {
      const sykmeldingWithUtdypendeOpplysningerPkt63 =
        mockSykmeldingerWithUtdypendeOpplysningerPkt63();

      const expectedUtdypendeOpplysninger =
        sykmeldingWithUtdypendeOpplysningerPkt63.utdypendeOpplysninger;

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithUtdypendeOpplysningerPkt63,
        sykmeldtFnr
      );

      expect(outputSM.utdypendeOpplysninger).to.deep.equal(
        expectedUtdypendeOpplysninger
      );
    });

    it("Returns correct utdypendeOpplysninger without utdypende opplysninger", () => {
      const mockSM = mockSykmeldinger[0];

      const expectedUtdypendeOpplysninger = mockSM.utdypendeOpplysninger;

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.utdypendeOpplysninger).to.deep.equal(
        expectedUtdypendeOpplysninger
      );
    });

    it("Returns correct utdypendeOpplysninger with only some fields", () => {
      const sykmeldingWithUtdypendeOpplysningerPkt62 =
        mockSykmeldingerWithUtdypendeOpplysningerPkt62SomeFieldsOmitted();

      const expectedUtdypendeOpplysninger =
        mockSykmeldingerWithUtdypendeOpplysningerPkt62SomeFieldsOmitted()
          .utdypendeOpplysninger;

      const outputSM = newSMFormat2OldFormat(
        sykmeldingWithUtdypendeOpplysningerPkt62,
        sykmeldtFnr
      );

      expect(outputSM.utdypendeOpplysninger).to.deep.equal(
        expectedUtdypendeOpplysninger
      );
    });
  });

  describe("valgtArbeidssituasjon", () => {
    it("Returns correct valgtArbeidssituasjon arbeidstaker", () => {
      const outputSM = newSMFormat2OldFormat(
        mockSykmeldingWithSporsmalOgSvarListe(),
        sykmeldtFnr
      );

      expect(outputSM.valgtArbeidssituasjon).to.deep.equal("ARBEIDSTAKER");
    });

    it("Returns correct valgtArbeidssituasjon without info", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.valgtArbeidssituasjon).to.deep.equal(undefined);
    });
  });

  describe("egenmeldt", () => {
    it("Returns correct egenmeldt", () => {
      const outputSM = newSMFormat2OldFormat(
        mockSykmeldingerWithEgenmeldt,
        sykmeldtFnr
      );

      expect(outputSM.egenmeldt).to.deep.equal(true);
    });

    it("Returns correct egenmeldt without info", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.egenmeldt).to.deep.equal(undefined);
    });
  });

  describe("harRedusertArbeidsgiverperiode", () => {
    it("Returns correct harRedusertArbeidsgiverperiode", () => {
      const outputSM = newSMFormat2OldFormat(
        mockSykmeldingerWithHarRedusertArbeidsgiverperiode,
        sykmeldtFnr
      );

      expect(outputSM.harRedusertArbeidsgiverperiode).to.deep.equal(true);
    });

    it("Returns correct harRedusertArbeidsgiverperiode without info", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.harRedusertArbeidsgiverperiode).to.deep.equal(undefined);
    });
  });

  describe("papirsykmelding", () => {
    it("Returns correct papirsykmelding", () => {
      const outputSM = newSMFormat2OldFormat(
        mockSykmeldingerWithPapirsykmelding,
        sykmeldtFnr
      );

      expect(outputSM.papirsykmelding).to.deep.equal(true);
    });

    it("Returns correct papirsykmelding without info", () => {
      const mockSM = mockSykmeldinger[0];

      const outputSM = newSMFormat2OldFormat(mockSM, sykmeldtFnr);

      expect(outputSM.papirsykmelding).to.deep.equal(undefined);
    });
  });
});

describe("oldFormatSMForAG", () => {
  it("Returns correct arbeidsevne for AG when arbeidsevne is given", () => {
    const sykmeldingWithArbeidsevne = mockSykmeldingWithArbeidsevne;

    const expectedArbeidsevne = {
      tilretteleggingArbeidsplass: "Tilrettelegging",
      tiltakAndre: undefined,
      tiltakNAV: undefined,
    };

    const outputSM = oldFormatSMForAG(sykmeldingWithArbeidsevne, sykmeldtFnr);

    expect(outputSM.arbeidsevne).to.deep.equal(expectedArbeidsevne);
  });

  it("Returns correct AG version when diagnose is given, all fields empty", () => {
    const sykmeldingWithDiagnose = mockSykmeldingWithDiagnoseInfo;

    const expectedDiagnose = {
      bidiagnoser: [],
      fravaerBeskrivelse: undefined,
      fravaersgrunnLovfestet: undefined,
      hoveddiagnose: undefined,
      svangerskap: undefined,
      yrkesskade: undefined,
      yrkesskadeDato: undefined,
    };

    const outputSM = oldFormatSMForAG(sykmeldingWithDiagnose, sykmeldtFnr);

    expect(outputSM.diagnose).to.deep.equal(expectedDiagnose);
  });

  it("Returns correct AG version with friskmelding when SM has Prognose for erIArbeid", () => {
    const sykmeldingWithPrognoseErIArbeid = mockSykmeldingWithPrognoseErIArbeid;

    const expectedFriskmelding = {
      antarReturAnnenArbeidsgiver: true,
      antarReturSammeArbeidsgiver: true,
      antattDatoReturSammeArbeidsgiver: toDate("2020-01-22"),
      arbeidsfoerEtterPerioden: true,
      hensynPaaArbeidsplassen: "Hensyn",
      tilbakemeldingReturArbeid: undefined,
      utenArbeidsgiverAntarTilbakeIArbeid: undefined,
      utenArbeidsgiverAntarTilbakeIArbeidDato: undefined,
      utenArbeidsgiverTilbakemelding: undefined,
    };

    const outputSM = oldFormatSMForAG(
      sykmeldingWithPrognoseErIArbeid,
      sykmeldtFnr
    );

    expect(outputSM.friskmelding).to.deep.equal(expectedFriskmelding);
  });

  it("Returns correct AG version with friskmelding when SM has Prognose for erIkkeIArbeid", () => {
    const sykmeldingWithPrognoseErIkkeIArbeid =
      mockSykmeldingWithPrognoseErIkkeIArbeid;

    const expectedFriskmelding: FriskmeldingDTO = {
      antarReturAnnenArbeidsgiver: undefined,
      antarReturSammeArbeidsgiver: undefined,
      antattDatoReturSammeArbeidsgiver: undefined,
      arbeidsfoerEtterPerioden: false,
      hensynPaaArbeidsplassen: "Hensyn",
      tilbakemeldingReturArbeid: undefined,
      utenArbeidsgiverAntarTilbakeIArbeid: undefined,
      utenArbeidsgiverAntarTilbakeIArbeidDato: undefined,
      utenArbeidsgiverTilbakemelding: undefined,
    };

    const outputSM = oldFormatSMForAG(
      sykmeldingWithPrognoseErIkkeIArbeid,
      sykmeldtFnr
    );

    expect(outputSM.friskmelding).to.deep.equal(expectedFriskmelding);
  });

  it("Returns correct AG version with meldingTilNav removed", () => {
    const sykmeldingWithMeldingTilNav = mockSykmeldingWithMeldingTilNav;

    const expectedMeldingTilNav = {
      navBoerTaTakISaken: undefined,
      navBoerTaTakISakenBegrunnelse: undefined,
    };

    const outputSM = oldFormatSMForAG(sykmeldingWithMeldingTilNav, sykmeldtFnr);

    expect(outputSM.meldingTilNav).to.deep.equal(expectedMeldingTilNav);
  });

  it("Returns correct AG version with mulighetForArbeid with aktivitetIkkeMulig", () => {
    const incomingSykmeldingPeriodeWithAktivitetIkkeMulig =
      mockSykmeldingWithPeriodeWithAktivitetIkkeMulig;

    const expectedMulighetForArbeid = {
      aarsakAktivitetIkkeMulig433: undefined,
      aarsakAktivitetIkkeMulig434: "Beskrivelse2",
      aktivitetIkkeMulig433: undefined,
      aktivitetIkkeMulig434: [
        arbeidsrelatertArsakTypetekster.MANGLENDE_TILRETTELEGGING,
      ],
      perioder: [
        {
          avventende: undefined,
          behandlingsdager: undefined,
          fom: toDate("2020-01-22"),
          grad: 100,
          reisetilskudd: undefined,
          tom: toDate("2020-05-22"),
        },
      ],
    };

    const outputSM = oldFormatSMForAG(
      incomingSykmeldingPeriodeWithAktivitetIkkeMulig,
      sykmeldtFnr
    );

    expect(outputSM.mulighetForArbeid).to.deep.equal(expectedMulighetForArbeid);
  });

  it("Returns correct AG version with mulighetForArbeid with more than one periode", () => {
    const incomingSykmeldingPeriodeWithGradert = mockSykmeldingWithTwoPerioder;

    const expectedMulighetForArbeid = {
      aarsakAktivitetIkkeMulig433: undefined,
      aarsakAktivitetIkkeMulig434: undefined,
      aktivitetIkkeMulig433: undefined,
      aktivitetIkkeMulig434: undefined,
      perioder: [
        {
          avventende: undefined,
          behandlingsdager: undefined,
          fom: toDate("2020-01-22"),
          grad: 100,
          reisetilskudd: undefined,
          tom: toDate("2020-05-22"),
        },
        {
          avventende: undefined,
          behandlingsdager: 2,
          fom: toDate("2020-02-17"),
          grad: undefined,
          reisetilskudd: undefined,
          tom: toDate("2020-03-01"),
        },
      ],
    };

    const outputSM = oldFormatSMForAG(
      incomingSykmeldingPeriodeWithGradert,
      sykmeldtFnr
    );

    expect(outputSM.mulighetForArbeid).to.deep.equal(expectedMulighetForArbeid);
  });

  it("Returns correct AG version with tilbakedatering", () => {
    const sykmeldingWithKontaktMedPasient = mockSykmeldingWithKontaktMedPasient;

    const expectedTilbakedatering = {
      dokumenterbarPasientkontakt: toDate("2020-02-02T02:02:02.202Z"),
      tilbakedatertBegrunnelse: undefined,
    };

    const outputSM = oldFormatSMForAG(
      sykmeldingWithKontaktMedPasient,
      sykmeldtFnr
    );

    expect(outputSM.tilbakedatering).to.deep.equal(expectedTilbakedatering);
  });

  it("Returns correct AG version with utdypendeOpplysninger removed when pkt 6.2", () => {
    const outputSM = oldFormatSMForAG(
      mockSykmeldingerWithUtdypendeOpplysningerPkt62(),
      sykmeldtFnr
    );

    expect(outputSM.utdypendeOpplysninger.size).to.equal(0);
  });

  it("Returns correct AG version with utdypendeOpplysninger removed when pkt 6.3", () => {
    const outputSM = oldFormatSMForAG(
      mockSykmeldingerWithUtdypendeOpplysningerPkt63(),
      sykmeldtFnr
    );

    expect(outputSM.utdypendeOpplysninger.size).to.equal(0);
  });
});
