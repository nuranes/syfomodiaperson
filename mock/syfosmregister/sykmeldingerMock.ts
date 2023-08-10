import dayjs from "dayjs";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  TODAY,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { daysFromToday } from "../../test/testUtils";

export const sykmeldingerMock = [
  {
    id: "1111a750-7f39-4974-9a06-fa1775f987d1",
    mottattTidspunkt: "2020-08-10T23:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          messageForUser:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          ruleName: "TSS_IDENT_MANGLER",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: {
      navn: "Virksomhet uten leder AS",
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: "Medisinsk årsak som hindrer arbeid",
            arsak: ["TILSTAND_HINDRER_AKTIVITET", "ANNET"],
          },
          arbeidsrelatertArsak: {
            beskrivelse: "Forhold på arbeidsplassen vanskeliggjør arbeid",
            arsak: ["MANGLENDE_TILRETTELEGGING", "ANNET"],
          },
        },
        fom: "2020-07-22",
        tom: TODAY,
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: {
          grad: 50,
          reisetilskudd: true,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: {
          grad: 50,
          reisetilskudd: false,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "REISETILSKUDD",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2020-06-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "REISETILSKUDD",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2020-06-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AVVENTENDE",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-02-25",
        tom: "2020-04-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AVVENTENDE",
      },
    ],
    sykmeldingStatus: {
      statusEvent: "SENDT",
      timestamp: "2020-01-29T09:38:05.414834Z",
      arbeidsgiver: {
        orgnummer: "000999000",
        juridiskOrgnummer: "000999000",
        orgNavn: "Virksomhet uten leder AS",
      },
      sporsmalOgSvarListe: null,
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "R28",
        system: "ICD-10",
        tekst:
          "Funksjonshemning på grunn av hypoksi/hyperkapné/redusert lungefunksjon/åndedrettssykdom/sykdom i nese, strupe, hode, hals",
      },
      biDiagnoser: [
        {
          kode: "R991",
          system: "ICPC-2",
          tekst: "Covid-19",
        },
      ],
      svangerskap: true,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-07-22",
        vurderingsdato: "2020-07-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket.",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Fortsett som sist.",
    tiltakNAV:
      "Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ",
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: "2020-07-22",
      begrunnelseIkkeKontakt: "Jeg vil tilbakedatere!!!",
    },
    behandletTidspunkt: "2020-08-10T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      mellomnavn: "Las",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      hpr: null,
      her: 7777777,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2020-07-22",
    navnFastlege: "Lego Las Legesen",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: true,
  },
  {
    id: "1111a750-7f39-4974-9a06-fa1775f987c9",
    mottattTidspunkt: "2020-08-10T23:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          messageForUser:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          ruleName: "TSS_IDENT_MANGLER",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: {
      navn: "BRANN OG BIL AS",
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: "Medisinsk årsak som hindrer arbeid",
            arsak: ["TILSTAND_HINDRER_AKTIVITET", "ANNET"],
          },
          arbeidsrelatertArsak: {
            beskrivelse: "Forhold på arbeidsplassen vanskeliggjør arbeid",
            arsak: ["MANGLENDE_TILRETTELEGGING", "ANNET"],
          },
        },
        fom: daysFromToday(-50),
        tom: daysFromToday(50),
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: {
          grad: 50,
          reisetilskudd: true,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: {
          grad: 50,
          reisetilskudd: false,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "REISETILSKUDD",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2020-06-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "REISETILSKUDD",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-06-25",
        tom: "2020-06-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AVVENTENDE",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-02-25",
        tom: "2020-04-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AVVENTENDE",
      },
    ],
    sykmeldingStatus: {
      statusEvent: "SENDT",
      timestamp: "2020-01-29T09:38:05.414834Z",
      arbeidsgiver: {
        orgnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
        juridiskOrgnummer: VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
        orgNavn: VIRKSOMHET_BRANNOGBIL.virksomhetsnavn,
      },
      sporsmalOgSvarListe: null,
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "R28",
        system: "ICD-10",
        tekst:
          "Funksjonshemning på grunn av hypoksi/hyperkapné/redusert lungefunksjon/åndedrettssykdom/sykdom i nese, strupe, hode, hals",
      },
      biDiagnoser: [
        {
          kode: "R991",
          system: "ICPC-2",
          tekst: "Covid-19",
        },
      ],
      svangerskap: true,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-07-22",
        vurderingsdato: "2020-07-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket.",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Fortsett som sist.",
    tiltakNAV:
      "Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ",
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: "2020-07-22",
      begrunnelseIkkeKontakt: "Jeg vil tilbakedatere!!!",
    },
    behandletTidspunkt: "2020-08-10T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      mellomnavn: "Las",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      hpr: null,
      her: 7777777,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2020-07-22",
    navnFastlege: "Lego Las Legesen",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: true,
  },
  {
    id: "222248ba-4c3c-4b3f-b7a3-385b7e7c927d",
    mottattTidspunkt: "2020-08-10T23:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          messageForUser:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          ruleName: "TSS_IDENT_MANGLER",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: {
      navn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        fom: "2020-07-22",
        tom: "2020-12-22",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
      {
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: {
          grad: 50,
          reisetilskudd: true,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
      {
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: {
          grad: 50,
          reisetilskudd: false,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
      {
        fom: "2020-06-25",
        tom: "2021-01-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "REISETILSKUDD",
      },
      {
        fom: "2020-06-25",
        tom: "2020-06-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "REISETILSKUDD",
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
      sporsmalOgSvarListe: null,
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "L87",
        system: "2.16.578.1.12.4.1.1.7170",
        tekst: "TENDINITT INA",
      },
      biDiagnoser: [
        {
          kode: "R28",
          system: "ICD-10",
          tekst:
            "Funksjonshemning på grunn av hypoksi/hyperkapné/redusert lungefunksjon/åndedrettssykdom/sykdom i nese, strupe, hode, hals",
        },
      ],
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-07-22",
        vurderingsdato: "2020-07-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket. Duplikatbuster: 6828077b-bfce-488d-b04b-22afe7f64500",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Fortsett som sist.",
    tiltakNAV:
      "Sende George på kostskole, han har plaget Pontypandy lenge nok nå",
    andreTiltak: null,
    meldingTilNAV: {
      bistandUmiddelbart: false,
      beskrivBistand: "Mye røykskader pga jobben",
    },
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: null,
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-08-10T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      mellomnavn: "Las",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      hpr: null,
      her: 7777777,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2020-07-22",
    navnFastlege: "Lego Las Legesen",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: false,
  },
  {
    id: "333148ba-4c3c-4b3f-b7a3-385b7e7c927d",
    mottattTidspunkt: "2020-08-10T23:00:00Z",
    behandlingsutfall: {
      status: "INVALID",
      ruleHits: [
        {
          messageForSender:
            "Sykmeldingen kan ikke rettes, det må skrives en ny. Pasienten har fått beskjed om å vente på ny sykmelding fra deg. Grunnet følgende:Kodeverk for hoveddiagnose er feil eller mangler.",
          messageForUser: "Den må ha riktig kode for hoveddiagnose.",
          ruleName: "UGYLDIG_KODEVERK_FOR_HOVEDDIAGNOSE",
          ruleStatus: "INVALID",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: {
      navn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        fom: "2020-04-22",
        tom: "2020-12-22",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
    ],
    sykmeldingStatus: {
      statusEvent: "APEN",
      timestamp: "2020-02-21T09:38:05.414834Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: null,
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "L87",
        system: "2.16.578.1.12.4.1.1.7170",
        tekst: "TENDINITT INA",
      },
      biDiagnoser: [
        {
          kode: "L87",
          system: "2.16.578.1.12.4.1.1.7170",
          tekst: "GANGLION SENE",
        },
      ],
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-07-22",
        vurderingsdato: "2020-07-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket. Duplikatbuster: 6828077b-bfce-488d-b04b-22afe7f64500",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Fortsett som sist.",
    tiltakNAV:
      "Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ",
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: null,
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-08-10T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      mellomnavn: "Las",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      hpr: null,
      her: 7777777,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2020-07-22",
    navnFastlege: "Lego Las Legesen",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: false,
  },
  {
    id: "444148ba-4c3c-4b3f-b7a3-385b7e7c927d",
    mottattTidspunkt: "2020-08-10T23:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          messageForUser:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          ruleName: "TSS_IDENT_MANGLER",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: {
      navn: VIRKSOMHET_PONTYPANDY.virksomhetsnavn,
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        fom: "2020-04-22",
        tom: "2021-01-25",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
    ],
    sykmeldingStatus: {
      statusEvent: "TIL_SENDING",
      timestamp: "2021-01-25T09:38:05.414834Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: null,
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "L87",
        system: "2.16.578.1.12.4.1.1.7170",
        tekst: "TENDINITT INA",
      },
      biDiagnoser: [
        {
          kode: "L87",
          system: "2.16.578.1.12.4.1.1.7170",
          tekst: "GANGLION SENE",
        },
      ],
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-04-22",
        vurderingsdato: "2020-07-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket. Duplikatbuster: 6828077b-bfce-488d-b04b-22afe7f64500",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Fortsett som sist.",
    tiltakNAV:
      "Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ",
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: null,
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-08-10T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      mellomnavn: "Las",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      hpr: null,
      her: 7777777,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2021-01-25",
    navnFastlege: "Lego Las Legesen",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: false,
  },
  {
    id: "5555a750-7f39-4974-9a06-fa1775f987c9",
    mottattTidspunkt: "2020-03-21T23:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          messageForUser:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          ruleName: "TSS_IDENT_MANGLER",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456788",
    arbeidsgiver: {
      navn: "USS Enterprise",
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: "Medisinsk årsak som hindrer arbeid",
            arsak: ["TILSTAND_HINDRER_AKTIVITET", "ANNET"],
          },
          arbeidsrelatertArsak: {
            beskrivelse: "Forhold på arbeidsplassen vanskeliggjør arbeid",
            arsak: ["MANGLENDE_TILRETTELEGGING", "ANNET"],
          },
        },
        fom: "2020-03-22",
        tom: "2020-006-22",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
      {
        aktivitetIkkeMulig: null,
        fom: "2020-04-25",
        tom: "2020-05-29",
        gradert: {
          grad: 67,
          reisetilskudd: true,
        },
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "GRADERT",
      },
    ],
    sykmeldingStatus: {
      statusEvent: "SENDT",
      timestamp: "2020-01-29T09:38:05.414834Z",
      arbeidsgiver: {
        orgnummer: "170100000",
        juridiskOrgnummer: "170100000",
        orgNavn: "USS Enterprise",
      },
      sporsmalOgSvarListe: [
        {
          tekst:
            "Hvilke dager var du borte fra jobb før datoen sykmeldingen gjelder fra?",
          shortName: "PERIODE",
          svar: {
            svarType: "PERIODER",
            svar: '[{"fom":"2020-02-24","tom":"2020-03-22"}]',
          },
        },
        {
          tekst:
            "Brukte du egenmelding eller noen annen sykmelding før datoen denne sykmeldingen gjelder fra?",
          shortName: "FRAVAER",
          svar: {
            svarType: "JA_NEI",
            svar: "JA",
          },
        },
        {
          tekst:
            "Har du forsikring som gjelder de første 16 dagene av sykefraværet?",
          shortName: "FORSIKRING",
          svar: {
            svarType: "JA_NEI",
            svar: "NEI",
          },
        },
        {
          tekst: "Jeg er sykmeldt fra",
          shortName: "ARBEIDSSITUASJON",
          svar: {
            svarType: "ARBEIDSSITUASJON",
            svar: "NAERINGSDRIVENDE",
          },
        },
      ],
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "R28",
        system: "ICD-10",
        tekst:
          "Funksjonshemning på grunn av hypoksi/hyperkapné/redusert lungefunksjon/åndedrettssykdom/sykdom i nese, strupe, hode, hals",
      },
      biDiagnoser: [
        {
          kode: "R991",
          system: "ICPC-2",
          tekst: "Covid-19",
        },
      ],
      svangerskap: true,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må unngå phaser blast",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-07-22",
        vurderingsdato: "2020-07-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket.",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Sette phasers til stun.",
    tiltakNAV: "Vedlikehold av holodeck",
    andreTiltak: null,
    meldingTilNAV: {
      bistandUmiddelbart: true,
      beskrivBistand:
        "Nav kan vise til egen forskning på faren med phaser blasts",
    },
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: null,
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-03-21T22:00:00Z",
    behandler: {
      fornavn: "Beverly",
      mellomnavn: null,
      etternavn: "Crusher",
      aktoerId: "1000014797128",
      fnr: "99900011123",
      hpr: null,
      her: 8888888,
      adresse: {
        gate: "Sickbay",
        postnummer: 1349,
        kommune: "Ship",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2020-03-22",
    navnFastlege: "Beverly G. Crusher",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: true,
  },
  {
    id: "6666cab3-bcb0-4dcb-9c97-bdb2ec867ec8",
    mottattTidspunkt: "2020-03-30T15:31:45.629405Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender: "Hvis pasienten ikke finnes i infotrygd",
          messageForUser: "Hvis pasienten ikke finnes i infotrygd",
          ruleName: "PATIENT_NOT_IN_IP",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "889640782",
    arbeidsgiver: {
      navn: null,
      stillingsprosent: null,
    },
    sykmeldingsperioder: [
      {
        fom: "2020-03-30",
        tom: "2020-04-14",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: null,
            arsak: [],
          },
          arbeidsrelatertArsak: null,
        },
        reisetilskudd: false,
      },
    ],
    sykmeldingStatus: {
      statusEvent: "APEN",
      timestamp: "2020-03-30T17:31:45.629405Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: [],
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "R991",
        system: "ICPC-2",
        tekst: "Covid-19 (mistenkt eller bekreftet)",
      },
      biDiagnoser: [],
      annenFraversArsak: null,
      svangerskap: false,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: null,
    utdypendeOpplysninger: {},
    tiltakArbeidsplassen: null,
    tiltakNAV: null,
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: "2020-03-30",
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-03-30T17:31:45.629313Z",
    behandler: {
      fornavn: ARBEIDSTAKER_DEFAULT.navn.fornavn,
      mellomnavn: null,
      etternavn: ARBEIDSTAKER_DEFAULT.navn.etternavn,
      aktoerId: "190269000101",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      hpr: "egenmeldt",
      her: null,
      adresse: {
        gate: null,
        postnummer: null,
        kommune: null,
        postboks: null,
        land: null,
      },
      tlf: "tel:55553336",
    },
    syketilfelleStartDato: "2020-03-30",
    navnFastlege: null,
    egenmeldt: true,
    papirsykmelding: false,
    harRedusertArbeidsgiverperiode: true,
  },
  {
    id: "7777cab3-bcb0-4dcb-9c97-bdb2ec867ec8",
    mottattTidspunkt: "2020-03-30T15:31:45.629405Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender: "Hvis pasienten ikke finnes i infotrygd",
          messageForUser: "Hvis pasienten ikke finnes i infotrygd",
          ruleName: "PATIENT_NOT_IN_IP",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "889640782",
    arbeidsgiver: {
      navn: null,
      stillingsprosent: null,
    },
    sykmeldingsperioder: [
      {
        fom: dayjs(new Date()).subtract(10, "days").toJSON(),
        tom: dayjs(new Date()).add(20, "days").toJSON(),
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: null,
            arsak: [],
          },
          arbeidsrelatertArsak: null,
        },
        reisetilskudd: false,
      },
    ],
    sykmeldingStatus: {
      statusEvent: "BEKREFTET",
      timestamp: "2020-03-30T17:55:12.426177Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: [
        {
          tekst: "Jeg er sykmeldt fra",
          shortName: "ARBEIDSSITUASJON",
          svar: {
            svarType: "ARBEIDSSITUASJON",
            svar: "NAERINGSDRIVENDE",
          },
        },
        {
          tekst: "Velg dagene du brukte egenmelding",
          shortName: "EGENMELDINGSDAGER",
          svar: {
            svarType: "DAGER",
            svar: '["2023-03-06","2023-03-10","2023-03-07","2023-03-08","2023-03-11"]',
          },
        },
      ],
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "R991",
        system: "ICPC-2",
        tekst: "Covid-19 (mistenkt eller bekreftet)",
      },
      biDiagnoser: [],
      annenFraversArsak: null,
      svangerskap: false,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: null,
    utdypendeOpplysninger: {},
    tiltakArbeidsplassen: null,
    tiltakNAV: null,
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: "2020-03-30",
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-03-30T17:31:45.629313Z",
    behandler: {
      fornavn: ARBEIDSTAKER_DEFAULT.navn.fornavn,
      mellomnavn: null,
      etternavn: ARBEIDSTAKER_DEFAULT.navn.etternavn,
      aktoerId: "190269000101",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      hpr: "egenmeldt",
      her: null,
      adresse: {
        gate: null,
        postnummer: null,
        kommune: null,
        postboks: null,
        land: null,
      },
      tlf: "tel:55553336",
    },
    syketilfelleStartDato: "2020-10-15",
    navnFastlege: null,
    egenmeldt: true,
    papirsykmelding: false,
    harRedusertArbeidsgiverperiode: true,
  },
  {
    id: "8888895e-b124-4c14-bc12-94a182da3ff6",
    mottattTidspunkt: "2020-03-30T18:24:34.496227Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Infotrygd returnerte en feil, vi kan ikke automatisk oppdatere Infotrygd",
          messageForUser:
            "Infotrygd returnerte en feil, vi kan ikke automatisk oppdatere Infotrygd",
          ruleName: "ERROR_FROM_IT_HOUVED_STATUS_KODEMELDING",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "889640782",
    arbeidsgiver: {
      navn: null,
      stillingsprosent: null,
    },
    sykmeldingsperioder: [
      {
        fom: "2020-03-01",
        tom: "2020-03-16",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: null,
            arsak: [],
          },
          arbeidsrelatertArsak: null,
        },
        reisetilskudd: false,
      },
    ],
    sykmeldingStatus: {
      statusEvent: "AVBRUTT",
      timestamp: "2020-03-30T20:25:38.90325Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: [],
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "R991",
        system: "ICPC-2",
        tekst: "Covid-19 (mistenkt eller bekreftet)",
      },
      biDiagnoser: [],
      annenFraversArsak: null,
      svangerskap: false,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: null,
    utdypendeOpplysninger: {},
    tiltakArbeidsplassen: null,
    tiltakNAV: null,
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: "2020-03-30",
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-03-30T20:24:34.496114Z",
    behandler: {
      fornavn: ARBEIDSTAKER_DEFAULT.navn.fornavn,
      mellomnavn: null,
      etternavn: ARBEIDSTAKER_DEFAULT.navn.etternavn,
      aktoerId: "190269000101",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      hpr: "egenmeldt",
      her: null,
      adresse: {
        gate: null,
        postnummer: null,
        kommune: null,
        postboks: null,
        land: null,
      },
      tlf: "tel:55553336",
    },
    syketilfelleStartDato: "2020-03-01",
    navnFastlege: null,
    egenmeldt: true,
    papirsykmelding: false,
    harRedusertArbeidsgiverperiode: true,
  },
  {
    id: "9999a750-7f39-4974-9a06-fa1775f987c9",
    mottattTidspunkt: "2020-08-10T23:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          messageForUser:
            "Behandlers TSS-ident er ikke funnet automatisk av systemet",
          ruleName: "TSS_IDENT_MANGLER",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: {
      navn: "X-Files",
      stillingsprosent: 100,
    },
    sykmeldingsperioder: [
      {
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: "Medisinsk årsak som hindrer arbeid",
            arsak: ["TILSTAND_HINDRER_AKTIVITET", "ANNET"],
          },
          arbeidsrelatertArsak: {
            beskrivelse: "Forhold på arbeidsplassen vanskeliggjør arbeid",
            arsak: ["MANGLENDE_TILRETTELEGGING", "ANNET"],
          },
        },
        fom: "2020-03-22",
        tom: "2020-05-22",
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
      },
    ],
    sykmeldingStatus: {
      statusEvent: "SENDT",
      timestamp: "2020-03-29T09:38:05.414834Z",
      arbeidsgiver: {
        orgnummer: "333666999",
        juridiskOrgnummer: "111444777",
        orgNavn: "X-Files",
      },
      sporsmalOgSvarListe: null,
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "L87",
        system: "ICD-10",
        tekst: "TENDINITT INA",
      },
      biDiagnoser: [],
      svangerskap: false,
      yrkesskade: false,
      yrkesskadeDato: null,
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-05-22",
        vurderingsdato: "2020-05-22",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket.",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: "Fortsett som sist.",
    tiltakNAV:
      "Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ",
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: null,
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-03-21T22:00:00Z",
    behandler: {
      fornavn: "Lego",
      mellomnavn: "Las",
      etternavn: "Legesen",
      aktoerId: "1000014797129",
      fnr: "99900011122",
      hpr: null,
      her: 7777777,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "12345678",
    },
    syketilfelleStartDato: "2020-07-22",
    navnFastlege: "Lego Las Legesen",
    egenmeldt: false,
    harRedusertArbeidsgiverperiode: false,
  },
  {
    id: "8361e922-2c92-4aa8-811d-e53ca958dc6a",
    mottattTidspunkt: "2020-10-14T20:00:00Z",
    behandlingsutfall: {
      status: "MANUAL_PROCESSING",
      ruleHits: [
        {
          messageForSender:
            "Infotrygd returnerte en feil, vi kan ikke automatisk oppdatere Infotrygd",
          messageForUser:
            "Infotrygd returnerte en feil, vi kan ikke automatisk oppdatere Infotrygd",
          ruleName: "ERROR_FROM_IT_HOUVED_STATUS_KODEMELDING",
          ruleStatus: "MANUAL_PROCESSING",
        },
      ],
    },
    legekontorOrgnummer: "223456789",
    arbeidsgiver: { navn: "LOMMEN BARNEHAVE", stillingsprosent: 100 },
    sykmeldingsperioder: [
      {
        fom: dayjs(new Date()).subtract(10, "days").toJSON(),
        tom: dayjs(new Date()).add(20, "days").toJSON(),
        gradert: null,
        behandlingsdager: null,
        innspillTilArbeidsgiver: null,
        type: "AKTIVITET_IKKE_MULIG",
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: "andre årsaker til sykefravær",
            arsak: ["AKTIVITET_FORHINDRER_BEDRING"],
          },
          arbeidsrelatertArsak: {
            beskrivelse: "andre årsaker til sykefravær",
            arsak: ["ANNET"],
          },
        },
        reisetilskudd: false,
      },
    ],
    sykmeldingStatus: {
      statusEvent: "BEKREFTET",
      timestamp: "2020-10-22T05:58:56.351983Z",
      arbeidsgiver: null,
      sporsmalOgSvarListe: [
        {
          tekst: "Jeg er sykmeldt fra",
          shortName: "ARBEIDSSITUASJON",
          svar: { svarType: "ARBEIDSSITUASJON", svar: "ARBEIDSLEDIG" },
        },
      ],
    },
    medisinskVurdering: {
      hovedDiagnose: {
        kode: "L87",
        system: "ICPC-2",
        tekst: "Bursitt/tendinitt/synovitt IKA",
      },
      biDiagnoser: [
        {
          kode: "L87",
          system: "ICPC-2",
          tekst: "Bursitt/tendinitt/synovitt IKA",
        },
      ],
      annenFraversArsak: null,
      svangerskap: false,
      yrkesskade: false,
      yrkesskadeDato: "2020-10-15",
    },
    skjermesForPasient: false,
    prognose: {
      arbeidsforEtterPeriode: true,
      hensynArbeidsplassen: "Må ta det pent",
      erIArbeid: {
        egetArbeidPaSikt: true,
        annetArbeidPaSikt: true,
        arbeidFOM: "2020-10-15",
        vurderingsdato: "2020-10-15",
      },
      erIkkeIArbeid: null,
    },
    utdypendeOpplysninger: {
      6.2: {
        "6.2.1": {
          sporsmal:
            "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
          svar: "Langvarig korsryggsmerter. Ømhet og smerte",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.2": {
          sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
          svar: "Kan ikke utføre arbeidsoppgaver 100% som kreves fra yrket. Duplikatbuster: e8f9991b-b363-40be-b94c-a5f30682bd2d",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.3": {
          sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
          svar: "Nei",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
        "6.2.4": {
          sporsmal:
            "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
          svar: "Henvist til fysio",
          restriksjoner: ["SKJERMET_FOR_ARBEIDSGIVER"],
        },
      },
    },
    tiltakArbeidsplassen: null,
    tiltakNAV:
      "Pasienten har plager som er kommet tilbake etter operasjon. Det er nylig tatt MR bildet som viser forandringer i hånd som mulig må opereres. Venter på time. Det er mulig sykemledingen vil vare utover aktuell sm periode. ",
    andreTiltak: null,
    meldingTilNAV: null,
    meldingTilArbeidsgiver: null,
    kontaktMedPasient: {
      kontaktDato: null,
      begrunnelseIkkeKontakt: null,
    },
    behandletTidspunkt: "2020-10-14T22:00:00Z",
    behandler: {
      fornavn: "Frida",
      mellomnavn: "Perma",
      etternavn: "Frost",
      aktoerId: "190269000101",
      fnr: "99900011122",
      hpr: null,
      her: null,
      adresse: {
        gate: "Kirkegårdsveien 3",
        postnummer: 1348,
        kommune: "Rykkinn",
        postboks: null,
        land: "Country",
      },
      tlf: "tel:94431152",
    },
    syketilfelleStartDato: "2020-10-15",
    navnFastlege: "Victor Frankenstein",
    egenmeldt: false,
    papirsykmelding: false,
    harRedusertArbeidsgiverperiode: false,
  },
];
