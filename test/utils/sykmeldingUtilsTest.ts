import { expect } from "chai";
import {
  arbeidsgivernavnEllerArbeidssituasjon,
  erArbeidsforEtterPerioden,
  erBedringAvArbeidsevnenInformasjon,
  erBehandlingsdagerEllerReisetilskudd,
  erEkstraDiagnoseInformasjon,
  erFriskmeldingInformasjon,
  erHensynPaaArbeidsplassenInformasjon,
  erMeldingTilArbeidsgiverInformasjon,
  erMeldingTilNavInformasjon,
  erMulighetForArbeidInformasjon,
  finnAvventendeSykmeldingTekst,
  getDiagnosekodeFromLatestSykmelding,
  latestSykmeldingForVirksomhet,
  sendtAndBekreftetSykmeldinger,
  stringMedAlleGraderingerFraSykmeldingPerioder,
  sykmeldingerGruppertEtterVirksomhet,
  sykmeldingerInnenforOppfolgingstilfelle,
  sykmeldingerMedStatusSendt,
  sykmeldingerSortertNyestTilEldst,
  sykmeldingperioderSortertEldstTilNyest,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { ANTALL_MS_DAG } from "@/utils/datoUtils";
import {
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";
import sinon from "sinon";
import dayjs from "dayjs";

const baseSykmelding: SykmeldingOldFormat = {
  arbeidsevne: {},
  behandlingsutfall: {
    ruleHits: [],
    status: BehandlingsutfallStatusDTO.OK,
  },
  bekreftelse: {},
  diagnose: {},
  friskmelding: {},
  id: "",
  meldingTilNav: {},
  mottattTidspunkt: new Date(),
  pasient: {},
  sendtdato: "",
  skalViseSkravertFelt: false,
  sporsmal: {},
  status: SykmeldingStatus.SENDT,
  tilbakedatering: {},
  utdypendeOpplysninger: new Map<string, Map<string, SporsmalSvarDTO>>(),
  mulighetForArbeid: {
    perioder: [],
  },
};

describe("sykmeldingUtils", () => {
  let clock: any;
  let today = new Date("2017-02-01");

  describe("finnAvventendeSykmeldingTekst", () => {
    it("skal returnere teksten fra avventende-feltet i en periode, hvis det finnes", () => {
      const innspillTilArbeidsgiver = "Innspill til arbeidsgiver";
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          perioder: [
            {
              avventende: innspillTilArbeidsgiver,
              behandlingsdager: undefined,
              fom: new Date("2019-01-01"),
              grad: 100,
              reisetilskudd: undefined,
              tom: new Date("2019-01-10"),
            },
          ],
        },
      };

      const avventende = finnAvventendeSykmeldingTekst(sykmelding);

      expect(avventende).to.equal(innspillTilArbeidsgiver);
    });

    it("skal returnere undefined hvis ingen av periodene er avventende", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          perioder: [
            {
              avventende: undefined,
              behandlingsdager: undefined,
              fom: new Date("2019-01-01"),
              grad: undefined,
              reisetilskudd: undefined,
              tom: new Date("2019-01-10"),
            },
          ],
        },
      };

      const avventende = finnAvventendeSykmeldingTekst(sykmelding);

      expect(avventende).to.equal(undefined);
    });
  });

  describe("erBehandlingsdagerEllerReisetilskudd", () => {
    it("skal returnere true dersom minst én av sykmeldingperiodene er huket av på behandlingsdager", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          perioder: [
            {
              avventende: undefined,
              behandlingsdager: 4,
              fom: new Date("2019-01-01"),
              grad: undefined,
              reisetilskudd: undefined,
              tom: new Date("2019-02-01"),
            },
          ],
        },
      };

      const erEkstraInfo = erBehandlingsdagerEllerReisetilskudd(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });

    it("skal returnere true dersom minst én av sykmeldingperiodene er huket av på reisetilskudd", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          perioder: [
            {
              avventende: undefined,
              behandlingsdager: undefined,
              fom: new Date("2019-01-01"),
              grad: 40,
              reisetilskudd: true,
              tom: new Date("2019-02-01"),
            },
          ],
        },
      };

      const erEkstraInfo = erBehandlingsdagerEllerReisetilskudd(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });

    it("skal returnere false dersom ingen av sykmeldingperiodene er huket av på reisetilskudd eller behandlingsdager", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          perioder: [
            {
              avventende: undefined,
              behandlingsdager: undefined,
              fom: new Date("2019-01-01"),
              grad: 100,
              reisetilskudd: undefined,
              tom: new Date("2019-02-01"),
            },
          ],
        },
      };

      const erEkstraInfo = erBehandlingsdagerEllerReisetilskudd(sykmelding);

      expect(erEkstraInfo).to.equal(false);
    });
  });

  describe("erEkstraDiagnoseInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder ekstra informasjon om diagnose", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        diagnose: {
          fravaersgrunnLovfestet: "Lovfestet grunn!",
          svangerskap: false,
          yrkesskade: true,
        },
      };

      const erEkstraInfo = erEkstraDiagnoseInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder ekstra informasjon om diagnose", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        diagnose: {
          fravaersgrunnLovfestet: undefined,
          svangerskap: false,
          yrkesskade: false,
        },
      };

      const erIkkeEkstraInfo = erEkstraDiagnoseInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erMulighetForArbeidInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om mulighet for arbeid", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          aarsakAktivitetIkkeMulig433: "andre årsaker til sykefravær",
          aarsakAktivitetIkkeMulig434: "andre årsaker til sykefravær",
          aktivitetIkkeMulig433: ["Annet"],
          aktivitetIkkeMulig434: ["Annet"],
          perioder: [
            {
              avventende: undefined,
              behandlingsdager: undefined,
              fom: new Date("2018-12-28"),
              grad: 100,
              reisetilskudd: undefined,
              tom: new Date("2019-01-08"),
            },
            {
              avventende: undefined,
              behandlingsdager: undefined,
              fom: new Date("2018-01-09"),
              grad: 21,
              reisetilskudd: undefined,
              tom: new Date("2019-01-15"),
            },
          ],
        },
      };

      const erEkstraInfo = erMulighetForArbeidInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om mulighet for arbeid", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        mulighetForArbeid: {
          perioder: [
            {
              avventende: undefined,
              behandlingsdager: undefined,
              fom: new Date("2018-12-28"),
              grad: 100,
              reisetilskudd: undefined,
              tom: new Date("2019-01-08"),
            },
          ],
        },
      };

      const erIkkeEkstraInfo = erMulighetForArbeidInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erFriskmeldingInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om friskmelding", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        friskmelding: {
          antarReturAnnenArbeidsgiver: true,
          antarReturSammeArbeidsgiver: true,
          utenArbeidsgiverAntarTilbakeIArbeid: false,
        },
      };

      const erEkstraInfo = erFriskmeldingInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om friskmelding", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        friskmelding: {
          antarReturAnnenArbeidsgiver: false,
          antarReturSammeArbeidsgiver: false,
          utenArbeidsgiverAntarTilbakeIArbeid: false,
        },
      };

      const erIkkeEkstraInfo = erFriskmeldingInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erArbeidsforEtterPerioden", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om den sykmeldte er arbeidsfør etter perioden", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        friskmelding: {
          arbeidsfoerEtterPerioden: true,
        },
      };

      const erEkstraInfo = erArbeidsforEtterPerioden(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om den sykmeldte er arbeidsfør etter perioden", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        friskmelding: {
          arbeidsfoerEtterPerioden: false,
        },
      };

      const erIkkeEkstraInfo = erArbeidsforEtterPerioden(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erHensynPaaArbeidsplassenInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om hensyn på arbeidsplassen", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        friskmelding: {
          hensynPaaArbeidsplassen: "Må ta det pent",
        },
      };

      const erEkstraInfo = erHensynPaaArbeidsplassenInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om hensyn på arbeidsplassen", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        friskmelding: {
          hensynPaaArbeidsplassen: undefined,
        },
      };

      const erIkkeEkstraInfo = erHensynPaaArbeidsplassenInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erBedringAvArbeidsevnenInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om bedring av arbeidsevnen", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        arbeidsevne: {
          tilretteleggingArbeidsplass: "Trenger nye sko",
          tiltakAndre: "Pasienten vil ha nye sko!",
          tiltakNAV: "NAV må gi pasienten skosåler til de nye skoene",
        },
      };

      const erEkstraInfo = erBedringAvArbeidsevnenInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om bedring av arbeidsevnen", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        arbeidsevne: {
          tilretteleggingArbeidsplass: undefined,
          tiltakAndre: undefined,
          tiltakNAV: undefined,
        },
      };

      const erIkkeEkstraInfo = erBedringAvArbeidsevnenInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erMeldingTilNavInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om melding til nav", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        meldingTilNav: {
          navBoerTaTakISaken: true,
        },
      };

      const erEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om melding til nav", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        meldingTilNav: {
          navBoerTaTakISaken: false,
        },
      };

      const erIkkeEkstraInfo = erMeldingTilNavInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("erMeldingTilArbeidsgiverInformasjon", () => {
    it("skal returnere true dersom sykmeldingen inneholder informasjon om melding til arbeidsgiver", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        innspillTilArbeidsgiver: "Arbeidsgiver må gjøre noe!",
      };

      const erEkstraInfo = erMeldingTilArbeidsgiverInformasjon(sykmelding);

      expect(erEkstraInfo).to.equal(true);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder informasjon om melding til arbeidsgiver", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        innspillTilArbeidsgiver: undefined,
      };

      const erIkkeEkstraInfo = erMeldingTilArbeidsgiverInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
    it("skal returnere false dersom sykmeldingen ikke inneholder innspillTilArbeidsgiver-felt, er undefined", () => {
      const sykmelding = baseSykmelding;

      const erIkkeEkstraInfo = erMeldingTilArbeidsgiverInformasjon(sykmelding);

      expect(erIkkeEkstraInfo).to.equal(false);
    });
  });

  describe("arbeidsgivernavnEllerArbeidssituasjon", () => {
    it("skal returnere navnet på arbeidsgiveren dersom det er satt", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        innsendtArbeidsgivernavn: "Test Arbeidsgiver",
      };

      const innsendtArbeidsgivernavn =
        arbeidsgivernavnEllerArbeidssituasjon(sykmelding);

      expect(innsendtArbeidsgivernavn).to.equal("Test Arbeidsgiver");
    });
    it("Skal returnere arbeidssituasjon dersom innsendt arbeidsgivernavn ikke er satt", () => {
      const sykmelding: SykmeldingOldFormat = {
        ...baseSykmelding,
        innsendtArbeidsgivernavn: undefined,
        sporsmal: {
          arbeidssituasjon: "NAERINGSDRIVENDE",
        },
      };

      const arbeidssituasjon =
        arbeidsgivernavnEllerArbeidssituasjon(sykmelding);

      expect(arbeidssituasjon).to.equal("Selvstendig næringsdrivende");
    });
  });

  describe("sykmeldingerMedStatusSendt", () => {
    it("skal returnere en liste med bare innsendte sykmeldinger", () => {
      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          status: SykmeldingStatus.AVBRUTT,
        },
        {
          ...baseSykmelding,
          status: SykmeldingStatus.SENDT,
        },
        {
          ...baseSykmelding,
          status: SykmeldingStatus.AVBRUTT,
        },
      ];

      const sendteSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);

      expect(sendteSykmeldinger.length).to.equal(1);
    });
  });

  describe("sykmeldingerInnenforOppfolgingstilfelle", () => {
    beforeEach(() => {
      today = new Date("2017-05-31");
      clock = sinon.useFakeTimers(today.getTime());
    });
    afterEach(() => {
      clock.restore();
    });

    it("skal returnere en liste med bare sykmeldinger som starter innenfor oppfølgingstilfellet", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-05-01");
      const oppfolgingstilfelle = {
        arbeidstakerAtTilfelleEnd: true,
        start: startDate,
        end: endDate,
        virksomhetsnummerList: ["123", "321", "999"],
      };

      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          orgnummer: "123",
          mulighetForArbeid: {
            perioder: [
              {
                fom: startDate,
                tom: endDate,
              },
            ],
          },
        },
        {
          ...baseSykmelding,
          orgnummer: "321",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(startDate.getDate() - ANTALL_MS_DAG * 10),
                tom: new Date(startDate.getDate() - ANTALL_MS_DAG),
              },
            ],
          },
        },
        {
          ...baseSykmelding,
          orgnummer: "999",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(endDate.getDate() + ANTALL_MS_DAG),
                tom: new Date(endDate.getDate() + ANTALL_MS_DAG * 10),
              },
            ],
          },
        },
      ];

      const sykmeldingerIOppfolgingstilfellet =
        sykmeldingerInnenforOppfolgingstilfelle(
          sykmeldinger,
          oppfolgingstilfelle
        );

      expect(sykmeldingerIOppfolgingstilfellet.length).to.equal(1);
      expect(sykmeldingerIOppfolgingstilfellet[0].orgnummer).to.equal("123");
    });

    it("skal returnere en liste med sykmeldinger uavhengig av virksomhet", () => {
      const startDate = new Date("2023-01-01");
      const endDate = new Date("2023-05-01");
      const oppfolgingstilfelle = {
        arbeidstakerAtTilfelleEnd: true,
        start: startDate,
        end: endDate,
        virksomhetsnummerList: ["123", "321", "999"],
      };
      const virksomhetNotInTilfelle = "000000";

      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          orgnummer: "123",
          mulighetForArbeid: {
            perioder: [
              {
                fom: startDate,
                tom: endDate,
              },
            ],
          },
        },
        {
          ...baseSykmelding,
          orgnummer: virksomhetNotInTilfelle,
          mulighetForArbeid: {
            perioder: [
              {
                fom: startDate,
                tom: endDate,
              },
            ],
          },
        },
        {
          ...baseSykmelding,
          orgnummer: "999",
          mulighetForArbeid: {
            perioder: [
              {
                fom: new Date(endDate.getDate() + ANTALL_MS_DAG),
                tom: new Date(endDate.getDate() + ANTALL_MS_DAG * 10),
              },
            ],
          },
        },
      ];

      const sykmeldingerIOppfolgingstilfellet =
        sykmeldingerInnenforOppfolgingstilfelle(
          sykmeldinger,
          oppfolgingstilfelle
        );

      expect(sykmeldingerIOppfolgingstilfellet.length).to.equal(2);
      expect(sykmeldingerIOppfolgingstilfellet[0].orgnummer).to.equal("123");
      expect(sykmeldingerIOppfolgingstilfellet[1].orgnummer).to.equal(
        virksomhetNotInTilfelle
      );
    });
  });

  describe("sykmeldingerSortertNyestTilEldst", () => {
    it("skal returnere en liste med sykmeldinger sortert etter utstedelsesdato", () => {
      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          bekreftelse: {
            utstedelsesdato: new Date("2019-01-05"),
          },
        },
        {
          ...baseSykmelding,
          bekreftelse: {
            utstedelsesdato: new Date("2019-01-01"),
          },
        },
        {
          ...baseSykmelding,
          bekreftelse: {
            utstedelsesdato: new Date("2019-01-02"),
          },
        },
        {
          ...baseSykmelding,
          bekreftelse: {
            utstedelsesdato: new Date("2019-01-04"),
          },
        },
        {
          ...baseSykmelding,
          bekreftelse: {
            utstedelsesdato: new Date("2019-01-03"),
          },
        },
      ];

      const sykmeldingerSortertPaaUtstedelsesdato =
        sykmeldingerSortertNyestTilEldst(sykmeldinger);

      expect(sykmeldingerSortertPaaUtstedelsesdato.length).to.equal(5);
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[0].bekreftelse.utstedelsesdato?.getTime()
      ).to.equal(new Date("2019-01-05").getTime());
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[1].bekreftelse.utstedelsesdato?.getTime()
      ).to.equal(new Date("2019-01-04").getTime());
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[2].bekreftelse.utstedelsesdato?.getTime()
      ).to.equal(new Date("2019-01-03").getTime());
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[3].bekreftelse.utstedelsesdato?.getTime()
      ).to.equal(new Date("2019-01-02").getTime());
      expect(
        sykmeldingerSortertPaaUtstedelsesdato[4].bekreftelse.utstedelsesdato?.getTime()
      ).to.equal(new Date("2019-01-01").getTime());
    });
  });

  describe("sykmeldingerGruppertEtterVirksomhet", () => {
    it("skal returnere en liste med én liste av sykmeldinger per virksomhet", () => {
      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          mottakendeArbeidsgiver: {
            navn: "Arbeidsgiver",
            virksomhetsnummer: "1",
            juridiskOrgnummer: "1",
          },
        },
        {
          ...baseSykmelding,
          mottakendeArbeidsgiver: {
            navn: "Arbeidsgiver",
            virksomhetsnummer: "2",
            juridiskOrgnummer: "2",
          },
        },
        {
          ...baseSykmelding,
          mottakendeArbeidsgiver: {
            navn: "Arbeidsgiver",
            virksomhetsnummer: "2",
            juridiskOrgnummer: "2",
          },
        },
        {
          ...baseSykmelding,
          mottakendeArbeidsgiver: {
            navn: "Arbeidsgiver",
            virksomhetsnummer: "3",
            juridiskOrgnummer: "3",
          },
        },
        {
          ...baseSykmelding,
          mottakendeArbeidsgiver: {
            navn: "Arbeidsgiver",
            virksomhetsnummer: "1",
            juridiskOrgnummer: "1",
          },
        },
        {
          ...baseSykmelding,
          mottakendeArbeidsgiver: {
            navn: "Arbeidsgiver",
            virksomhetsnummer: "1",
            juridiskOrgnummer: "1",
          },
        },
      ];

      const sykmeldingerSortertPaaVirksomhetsnummer =
        sykmeldingerGruppertEtterVirksomhet(sykmeldinger);

      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer).length
      ).to.equal(3);
      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer["1"]).length
      ).to.equal(3);
      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer["2"]).length
      ).to.equal(2);
      expect(
        Object.keys(sykmeldingerSortertPaaVirksomhetsnummer["3"]).length
      ).to.equal(1);
    });
  });

  describe("sykmeldingperioderSortertEldstTilNyest", () => {
    it("skal returnere en liste med perioder sortert etter dato", () => {
      const sykmeldingperioder: SykmeldingPeriodeDTO[] = [
        {
          fom: new Date("2019-01-05"),
          tom: new Date(),
        },
        {
          fom: new Date("2019-01-04"),
          tom: new Date(),
        },
        {
          fom: new Date("2019-01-01"),
          tom: new Date(),
        },
        {
          fom: new Date("2019-01-02"),
          tom: new Date(),
        },
        {
          fom: new Date("2019-01-03"),
          tom: new Date(),
        },
      ];

      const sykmeldingperioderSortertEtterDato =
        sykmeldingperioderSortertEldstTilNyest(sykmeldingperioder);

      expect(sykmeldingperioderSortertEtterDato.length).to.equal(5);
      expect(sykmeldingperioderSortertEtterDato[0].fom.getTime()).to.equal(
        new Date("2019-01-01").getTime()
      );
      expect(sykmeldingperioderSortertEtterDato[1].fom.getTime()).to.equal(
        new Date("2019-01-02").getTime()
      );
      expect(sykmeldingperioderSortertEtterDato[2].fom.getTime()).to.equal(
        new Date("2019-01-03").getTime()
      );
      expect(sykmeldingperioderSortertEtterDato[3].fom.getTime()).to.equal(
        new Date("2019-01-04").getTime()
      );
      expect(sykmeldingperioderSortertEtterDato[4].fom.getTime()).to.equal(
        new Date("2019-01-05").getTime()
      );
    });
  });

  describe("stringMedAlleGraderingerFraSykmeldingPerioder", () => {
    it("skal returnere en string med alle graderinger fra en sykmelding som ikke er 0/null", () => {
      const sykmeldingPerioderSortertEtterDato: SykmeldingPeriodeDTO[] = [
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: 20,
        },
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: 100,
        },
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: 0,
        },
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: undefined,
        },
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: 50,
        },
      ];

      const stringMedAllegraderinger =
        stringMedAlleGraderingerFraSykmeldingPerioder(
          sykmeldingPerioderSortertEtterDato
        );

      expect(stringMedAllegraderinger).to.equal("20% - 100% - 50%");
    });

    it("skal returnere en tom string hvis alle perioder har 0/null som grad", () => {
      const sykmeldingPerioderSortertEtterDato: SykmeldingPeriodeDTO[] = [
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: undefined,
        },
        {
          fom: new Date(Date.now() - 1000),
          tom: new Date(Date.now() + 1000),
          grad: 0,
        },
      ];

      const stringMedAllegraderinger =
        stringMedAlleGraderingerFraSykmeldingPerioder(
          sykmeldingPerioderSortertEtterDato
        );

      expect(stringMedAllegraderinger).to.equal("");
    });
  });

  describe("latestSykmeldingForVirksomhet", () => {
    it("skal returnere sykmeldingen hvis det kun er én, og den hører til riktig virksomhet", () => {
      const wantedVirksomhetsnummer = "11223344";
      const wantedSykmeldingId = "1";
      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          id: wantedSykmeldingId,
          status: SykmeldingStatus.SENDT,
          bekreftelse: {
            utstedelsesdato: new Date(Date.now() - 1000),
          },
          mottakendeArbeidsgiver: {
            virksomhetsnummer: wantedVirksomhetsnummer,
            navn: "Arbeidsgiver",
            juridiskOrgnummer: "1",
          },
        },
      ];

      const actualSykmelding = latestSykmeldingForVirksomhet(
        sykmeldinger,
        wantedVirksomhetsnummer
      );

      expect(actualSykmelding.id).to.equal(wantedSykmeldingId);
    });

    it("skal returnere undefined hvis ingen sykmeldinger i listen", () => {
      const wantedVirksomhetsnummer = "11223344";
      const sykmeldinger: any[] = [];

      const actualSykmelding = latestSykmeldingForVirksomhet(
        sykmeldinger,
        wantedVirksomhetsnummer
      );

      expect(actualSykmelding).to.equal(undefined);
    });

    it("skal returnere undefined hvis det ikke finnes en sykmelding fra ønsket virksomhet", () => {
      const wantedVirksomhetsnummer = "11223344";
      const wrongVirksomhetsnummer = "99988877";
      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          id: "1",
          status: SykmeldingStatus.SENDT,
          bekreftelse: {
            utstedelsesdato: new Date(Date.now() - 1000),
          },
          mottakendeArbeidsgiver: {
            virksomhetsnummer: wrongVirksomhetsnummer,
            juridiskOrgnummer: wrongVirksomhetsnummer,
            navn: "Arbeidsgiver",
          },
        },
      ];

      const actualSykmelding = latestSykmeldingForVirksomhet(
        sykmeldinger,
        wantedVirksomhetsnummer
      );

      expect(actualSykmelding).to.equal(undefined);
    });

    it("skal returnere riktig sykmelding hvis én er fra riktig og én er fra feil virksomhet", () => {
      const wantedVirksomhetsnummer = "11223344";
      const wrongVirksomhetsnummer = "99988877";
      const wantedSykmeldingId = "1";

      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          id: wantedSykmeldingId,
          status: SykmeldingStatus.SENDT,
          bekreftelse: {
            utstedelsesdato: new Date(Date.now() - 1000),
          },
          mottakendeArbeidsgiver: {
            virksomhetsnummer: wantedVirksomhetsnummer,
            navn: "Arbeidsgiver",
            juridiskOrgnummer: wantedVirksomhetsnummer,
          },
        },
        {
          ...baseSykmelding,
          id: "2",
          status: SykmeldingStatus.SENDT,
          bekreftelse: {
            utstedelsesdato: new Date(Date.now() - 1000),
          },
          mottakendeArbeidsgiver: {
            virksomhetsnummer: wrongVirksomhetsnummer,
            juridiskOrgnummer: wrongVirksomhetsnummer,
            navn: "Arbeidsgiver",
          },
        },
      ];

      const actualSykmelding = latestSykmeldingForVirksomhet(
        sykmeldinger,
        wantedVirksomhetsnummer
      );

      expect(actualSykmelding.id).to.equal(wantedSykmeldingId);
    });

    it("skal returnere nyeste sykmelding hvis flere fra riktig virksomhet", () => {
      const wantedVirksomhetsnummer = "11223344";
      const wantedSykmeldingId = "1";
      const latestDate = new Date(Date.now() + 1000);
      const earliestDate = new Date(Date.now() - 1000);

      const sykmeldinger: SykmeldingOldFormat[] = [
        {
          ...baseSykmelding,
          id: "2",
          bekreftelse: {
            utstedelsesdato: earliestDate,
          },
          mottakendeArbeidsgiver: {
            virksomhetsnummer: wantedVirksomhetsnummer,
            juridiskOrgnummer: wantedVirksomhetsnummer,
            navn: "Arbeidsgiver",
          },
        },
        {
          ...baseSykmelding,
          id: wantedSykmeldingId,
          bekreftelse: {
            utstedelsesdato: latestDate,
          },
          mottakendeArbeidsgiver: {
            virksomhetsnummer: wantedVirksomhetsnummer,
            juridiskOrgnummer: wantedVirksomhetsnummer,
            navn: "Arbeidsgiver",
          },
        },
      ];

      const actualSykmelding = latestSykmeldingForVirksomhet(
        sykmeldinger,
        wantedVirksomhetsnummer
      );

      expect(actualSykmelding.id).to.equal(wantedSykmeldingId);
    });
  });

  describe("sendtAndBekreftetSykmeldinger", () => {
    const unwantedStatuser = [
      SykmeldingStatus.NY,
      SykmeldingStatus.UTGAATT,
      SykmeldingStatus.AVBRUTT,
      SykmeldingStatus.TIL_SENDING,
    ];

    const sykmeldingListContainsStatuser = (
      sykmeldinger: SykmeldingOldFormat[],
      statuser: SykmeldingStatus[]
    ): boolean => {
      return sykmeldinger.some((sykmelding) => {
        return statuser.includes(sykmelding.status);
      });
    };

    it("Returns a list containing only sykmeldinger with status SENDT and BEKREFTET", () => {
      const sykmeldinglistWithEveryStatus: SykmeldingOldFormat[] = Object.keys(
        SykmeldingStatus
      ).map((status) => {
        return {
          ...baseSykmelding,
          status,
        } as SykmeldingOldFormat;
      });

      const usedSykmeldinger = sendtAndBekreftetSykmeldinger(
        sykmeldinglistWithEveryStatus
      );

      const hasSykmeldingWithWrongStatus = sykmeldingListContainsStatuser(
        usedSykmeldinger,
        unwantedStatuser
      );
      const hasSendtSykmelding = sykmeldingListContainsStatuser(
        sykmeldinglistWithEveryStatus,
        [SykmeldingStatus.SENDT]
      );
      const hasBekreftetSykmelding = sykmeldingListContainsStatuser(
        sykmeldinglistWithEveryStatus,
        [SykmeldingStatus.BEKREFTET]
      );
      expect(usedSykmeldinger.length).to.equal(2);
      expect(hasSykmeldingWithWrongStatus).to.be.false;
      expect(hasSendtSykmelding).to.be.true;
      expect(hasBekreftetSykmelding).to.be.true;
    });

    it("Returns an empty list if only unwanted statuser in sykmelding list", () => {
      const sykmeldinglistWithEveryStatus: SykmeldingOldFormat[] =
        unwantedStatuser.map((status) => {
          return {
            ...baseSykmelding,
            status,
          } as SykmeldingOldFormat;
        });

      const usedSykmeldinger = sendtAndBekreftetSykmeldinger(
        sykmeldinglistWithEveryStatus
      );

      expect(usedSykmeldinger.length).to.equal(0);
    });
  });

  describe("getDiagnosekodeFromLatestSykmelding", () => {
    it("Returns diagnosekode from only sykmelding in list", () => {
      const wantedDiagnosekode = "A00";
      const sykmelding = {
        ...baseSykmelding,
        diagnose: {
          hoveddiagnose: {
            diagnosekode: wantedDiagnosekode,
            diagnosesystem: "ICD-10",
          },
        },
      };

      const diagnosekode = getDiagnosekodeFromLatestSykmelding([sykmelding]);

      expect(diagnosekode).to.equal(wantedDiagnosekode);
    });

    it("Returns diagnosekode from latest sykmelding in list", () => {
      const wantedDiagnosekode = "A00";
      const latestSykmelding = {
        ...baseSykmelding,
        bekreftelse: {
          utstedelsesdato: new Date(),
        },
        diagnose: {
          hoveddiagnose: {
            diagnosekode: wantedDiagnosekode,
            diagnosesystem: "ICD-10",
          },
        },
      };
      const oldestSykmelding = {
        ...baseSykmelding,
        bekreftelse: {
          utstedelsesdato: dayjs().subtract(100, "days").toDate(),
        },
        diagnose: {
          hoveddiagnose: {
            diagnosekode: "B99",
            diagnosesystem: "ICD-10",
          },
        },
      };

      const diagnosekode = getDiagnosekodeFromLatestSykmelding([
        latestSykmelding,
        oldestSykmelding,
      ]);

      expect(diagnosekode).to.equal(wantedDiagnosekode);
    });

    it("Returns empty string if no sykmeldinger in list", () => {
      const diagnosekode = getDiagnosekodeFromLatestSykmelding([]);

      expect(diagnosekode).to.equal("");
    });

    it("Returns empty string if latest sykmelding doesn't have diagnose", () => {
      const diagnosekode = getDiagnosekodeFromLatestSykmelding([
        baseSykmelding,
      ]);

      expect(diagnosekode).to.equal("");
    });
  });
});
