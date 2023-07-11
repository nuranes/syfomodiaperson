import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import { BehandlingsutfallStatusDTO } from "@/data/sykmelding/types/BehandlingsutfallStatusDTO";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { ShortNameDTO } from "@/data/sykmelding/types/ShortNameDTO";
import { SvartypeDTO } from "@/data/sykmelding/types/SvartypeDTO";
import {
  SykmeldingOldFormat,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { toDate, toDateWithoutNullCheck } from "@/utils/datoUtils";
import {
  Soknadstatus,
  Soknadstype,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { VIRKSOMHET_PONTYPANDY } from "../../../mock/common/mockConstants";

export const mockSykmeldingId = "test-id";

export const mockSykepengeSoknad: SykepengesoknadDTO = {
  arbeidsgiver: {
    navn: "KONKURS BEDRIFT OG VENNER AS",
    orgnummer: "000111222",
  },
  fom: toDateWithoutNullCheck("2018-08-18"),
  id: "123test",
  opprettetDato: toDateWithoutNullCheck("2018-09-07"),
  status: Soknadstatus.NY,
  sykmeldingId: mockSykmeldingId,
  tom: toDateWithoutNullCheck("2018-08-31"),
  soknadstype: Soknadstype.ARBEIDSTAKERE,
  sporsmal: [],
};

export const mockSykmeldinger: SykmeldingNewFormatDTO[] = [
  {
    id: mockSykmeldingId,
    mottattTidspunkt: "2020-01-21T23:00:00Z",
    behandlingsutfall: {
      status: BehandlingsutfallStatusDTO.OK,
      ruleHits: [
        {
          messageForSender: "messageForSender",
          messageForUser: "messageForUser",
          ruleName: "Rule",
          ruleStatus: BehandlingsutfallStatusDTO.OK,
        },
      ],
    },
    sykmeldingsperioder: [
      {
        fom: "2020-01-22",
        tom: "2020-05-22",
        type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
        reisetilskudd: false,
      },
    ],
    sykmeldingStatus: {
      statusEvent: "SENDT",
      timestamp: "2020-01-29T09:38:05.414834Z",
      arbeidsgiver: {
        orgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        juridiskOrgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        orgNavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      },
      sporsmalOgSvarListe: [
        {
          tekst: "Tekst",
          shortName: ShortNameDTO.FORSIKRING,
          svar: {
            svarType: SvartypeDTO.JA_NEI,
            svar: "svar",
          },
        },
      ],
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "tt",
        system: "tt",
      },
      biDiagnoser: [],
      svangerskap: false,
      yrkesskade: false,
    },
    skjermesForPasient: false,
    utdypendeOpplysninger: new Map(),
    kontaktMedPasient: {
      kontaktDato: undefined,
    },
    behandletTidspunkt: "2020-01-21T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      adresse: {
        gate: undefined,
      },
    },
  },
];

export const sykmeldingUtenArbeidsgiverMock = {
  ...mockSykmeldinger[0],
  sykmeldingStatus: {
    arbeidsgiver: undefined,
  },
};

export const mockOldSykmeldinger: SykmeldingOldFormat[] = [
  {
    arbeidsevne: {
      tilretteleggingArbeidsplass: undefined,
      tiltakAndre: undefined,
      tiltakNAV: undefined,
    },
    arbeidsgiver: undefined,
    bekreftelse: {
      sykmelder: "Lego Legesen",
      sykmelderTlf: undefined,
      utstedelsesdato: toDate("2020-01-21T22:00:00Z"),
    },
    diagnose: {
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
    },
    friskmelding: {
      antarReturAnnenArbeidsgiver: undefined,
      antarReturSammeArbeidsgiver: undefined,
      antattDatoReturSammeArbeidsgiver: undefined,
      arbeidsfoerEtterPerioden: undefined,
      hensynPaaArbeidsplassen: undefined,
      tilbakemeldingReturArbeid: undefined,
      utenArbeidsgiverAntarTilbakeIArbeid: undefined,
      utenArbeidsgiverAntarTilbakeIArbeidDato: undefined,
      utenArbeidsgiverTilbakemelding: undefined,
    },
    id: mockSykmeldingId,
    innsendtArbeidsgivernavn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
    innspillTilArbeidsgiver: undefined,
    meldingTilNav: {
      navBoerTaTakISaken: undefined,
      navBoerTaTakISakenBegrunnelse: undefined,
    },
    mottakendeArbeidsgiver: {
      juridiskOrgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
      navn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    },
    mulighetForArbeid: {
      aarsakAktivitetIkkeMulig433: undefined,
      aarsakAktivitetIkkeMulig434: undefined,
      aktivitetIkkeMulig433: undefined,
      aktivitetIkkeMulig434: undefined,
      perioder: [
        {
          avventende: undefined,
          behandlingsdager: undefined,
          fom: toDateWithoutNullCheck("2020-01-22"),
          grad: 100,
          reisetilskudd: undefined,
          tom: toDateWithoutNullCheck("2020-05-22"),
        },
      ],
    },
    naermesteLederStatus: undefined,
    orgnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    pasient: {
      etternavn: undefined,
      fnr: "99887766554",
      fornavn: undefined,
      mellomnavn: undefined,
    },
    sendtdato: "2020-01-29T09:38:05.414834Z",
    mottattTidspunkt: new Date("2020-01-21T23:00:00Z"),
    skalViseSkravertFelt: true,
    sporsmal: {
      arbeidssituasjon: undefined,
      fravaersperioder: [],
      harAnnetFravaer: false,
      harForsikring: false,
      egenmeldingsdager: [],
    },
    startLegemeldtFravaer: undefined,
    status: SykmeldingStatus.SENDT,
    stillingsprosent: undefined,
    tilbakedatering: {
      dokumenterbarPasientkontakt: undefined,
      tilbakedatertBegrunnelse: undefined,
    },
    utdypendeOpplysninger: new Map(),
    valgtArbeidssituasjon: undefined,
    behandlingsutfall: {
      status: BehandlingsutfallStatusDTO.OK,
      ruleHits: [
        {
          messageForSender: "messageForSender",
          messageForUser: "messageForUser",
          ruleName: "Rule",
          ruleStatus: BehandlingsutfallStatusDTO.OK,
        },
      ],
    },
    egenmeldt: undefined,
    papirsykmelding: undefined,
    harRedusertArbeidsgiverperiode: undefined,
  },
];
