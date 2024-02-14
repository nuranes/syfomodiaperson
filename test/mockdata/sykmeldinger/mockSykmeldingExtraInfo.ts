import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import { PeriodetypeDTO } from "@/data/sykmelding/types/PeriodetypeDTO";
import { MedisinskArsakTypeDTO } from "@/data/sykmelding/types/MedisinskArsakTypeDTO";
import { ArbeidsrelatertArsakTypeDTO } from "@/data/sykmelding/types/ArbeidsrelatertArsakTypeDTO";
import { SporsmalSvarDTO } from "@/data/sykmelding/types/SporsmalSvarDTO";
import { SvarRestriksjonDTO } from "@/data/sykmelding/types/SvarRestriksjonDTO";
import { SvartypeDTO } from "@/data/sykmelding/types/SvartypeDTO";
import { ShortNameDTO } from "@/data/sykmelding/types/ShortNameDTO";
import { AnnenFraverGrunnDTO } from "@/data/sykmelding/types/AnnenFraverGrunnDTO";
import { mockSykmeldinger } from "./mockSykmeldinger";
import { NyeSykmeldingStatuser } from "@/utils/sykmeldinger/sykmeldingstatuser";

const mockSM = mockSykmeldinger[0];

export const mockSykmeldingWithArbeidsevne: SykmeldingNewFormatDTO = {
  ...mockSM,
  tiltakArbeidsplassen: "Tilrettelegging",
  andreTiltak: "TiltakAndre",
  tiltakNAV: "TiltakAndre",
};

export const mockSykmeldingWithArbeidsgiver: SykmeldingNewFormatDTO = {
  ...mockSM,
  arbeidsgiver: {
    navn: "AG",
    stillingsprosent: 100,
  },
};

export const mockSykmeldingerWithBekreftelse: SykmeldingNewFormatDTO = {
  ...mockSM,
  behandler: {
    fornavn: "Lego",
    mellomnavn: "Las",
    etternavn: "Legesen",
    tlf: "12345678",
    adresse: {},
  },
  behandletTidspunkt: "2020-01-21T22:00:00Z",
};

export const mockSykmeldingWithDiagnoseInfo: SykmeldingNewFormatDTO = {
  ...mockSM,
  medisinskVurdering: {
    hovedDiagnose: {
      kode: "L87",
      system: "ICPC-2",
      tekst: "TENDINITT INA",
    },
    biDiagnoser: [
      {
        kode: "L87",
        system: "ICPC-2",
        tekst: "GANGLION SENE",
      },
    ],
    annenFraversArsak: {
      beskrivelse: "Annen Grunn",
      grunn: [AnnenFraverGrunnDTO.GODKJENT_HELSEINSTITUSJON],
    },
    svangerskap: true,
    yrkesskade: true,
    yrkesskadeDato: "2020-01-22",
  },
  skjermesForPasient: false,
};

export const mockSykmeldingWithPrognoseErIArbeid: SykmeldingNewFormatDTO = {
  ...mockSM,
  prognose: {
    arbeidsforEtterPeriode: true,
    hensynArbeidsplassen: "Hensyn",
    erIArbeid: {
      egetArbeidPaSikt: true,
      annetArbeidPaSikt: true,
      arbeidFOM: "2020-01-22",
      vurderingsdato: "2020-01-22",
    },
    erIkkeIArbeid: undefined,
  },
};

export const mockSykmeldingWithPrognoseErIkkeIArbeid: SykmeldingNewFormatDTO = {
  ...mockSM,
  prognose: {
    arbeidsforEtterPeriode: false,
    hensynArbeidsplassen: "Hensyn",
    erIArbeid: undefined,
    erIkkeIArbeid: {
      arbeidsforPaSikt: true,
      arbeidsforFOM: "2020-01-22",
      vurderingsdato: "2020-01-22",
    },
  },
};

export const mockSykmeldingWithMeldingTilNav: SykmeldingNewFormatDTO = {
  ...mockSM,
  meldingTilNAV: {
    bistandUmiddelbart: true,
    beskrivBistand: "Bistand",
  },
};

export const mockSykmeldingWithMottakendeArbeidsgiver: SykmeldingNewFormatDTO =
  {
    ...mockSM,
    sykmeldingStatus: {
      ...mockSM.sykmeldingStatus,
      arbeidsgiver: {
        juridiskOrgnummer: "1234567",
        orgNavn: "Bedrift",
        orgnummer: "7654321",
      },
    },
  };

export const mockSykmeldingWithoutMottakendeArbeidsgiver: SykmeldingNewFormatDTO =
  {
    ...mockSM,
    sykmeldingStatus: {
      ...mockSM.sykmeldingStatus,
      statusEvent: NyeSykmeldingStatuser.APEN,
      timestamp: "2020-01-28T09:38:05.414834Z",
      arbeidsgiver: undefined,
    },
  };

export const mockSykmeldingWithPeriodeWithAktivitetIkkeMulig: SykmeldingNewFormatDTO =
  {
    ...mockSM,
    sykmeldingsperioder: [
      {
        fom: "2020-01-22",
        tom: "2020-05-22",
        gradert: undefined,
        behandlingsdager: undefined,
        innspillTilArbeidsgiver: undefined,
        type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
        reisetilskudd: false,
        aktivitetIkkeMulig: {
          medisinskArsak: {
            beskrivelse: "Beskrivelse",
            arsak: [MedisinskArsakTypeDTO.TILSTAND_HINDRER_AKTIVITET],
          },
          arbeidsrelatertArsak: {
            beskrivelse: "Beskrivelse2",
            arsak: [ArbeidsrelatertArsakTypeDTO.MANGLENDE_TILRETTELEGGING],
          },
        },
      },
    ],
  };

export const mockSykmeldingWithPeriodeWithGradert: SykmeldingNewFormatDTO = {
  ...mockSM,
  sykmeldingsperioder: [
    {
      fom: "2020-01-22",
      tom: "2020-05-22",
      gradert: {
        grad: 50,
        reisetilskudd: true,
      },
      behandlingsdager: undefined,
      innspillTilArbeidsgiver: undefined,
      type: PeriodetypeDTO.GRADERT,
      aktivitetIkkeMulig: undefined,
      reisetilskudd: false,
    },
  ],
};

export const mockSykmeldingWithTwoPerioder: SykmeldingNewFormatDTO = {
  ...mockSM,
  sykmeldingsperioder: [
    {
      fom: "2020-01-22",
      tom: "2020-05-22",
      gradert: undefined,
      behandlingsdager: undefined,
      innspillTilArbeidsgiver: undefined,
      type: PeriodetypeDTO.AKTIVITET_IKKE_MULIG,
      aktivitetIkkeMulig: undefined,
      reisetilskudd: false,
    },
    {
      fom: "2020-02-17",
      tom: "2020-03-01",
      gradert: undefined,
      behandlingsdager: 2,
      innspillTilArbeidsgiver: undefined,
      type: PeriodetypeDTO.BEHANDLINGSDAGER,
      aktivitetIkkeMulig: undefined,
      reisetilskudd: false,
    },
  ],
};

export const mockSykmeldingWithStatus = (
  status: any
): SykmeldingNewFormatDTO => {
  return {
    ...mockSM,
    sykmeldingStatus: {
      statusEvent: status,
      timestamp: "2020-01-29T09:38:05.414834Z",
      arbeidsgiver: undefined,
      sporsmalOgSvarListe: [
        {
          tekst: "string",
          shortName: ShortNameDTO.NY_NARMESTE_LEDER,
          svar: {
            svarType: SvartypeDTO.JA_NEI,
            svar: "string",
          },
        },
      ],
    },
  };
};

export const mockSykmeldingWithSporsmalOgSvarListe =
  (): SykmeldingNewFormatDTO => {
    return {
      ...mockSM,
      sykmeldingStatus: {
        ...mockSM.sykmeldingStatus,
        sporsmalOgSvarListe: [
          {
            tekst: "Jeg er sykmeldt fra",
            svar: {
              svar: "ARBEIDSTAKER",
              svarType: SvartypeDTO.ARBEIDSSITUASJON,
            },
            shortName: ShortNameDTO.ARBEIDSSITUASJON,
          },
          {
            tekst:
              "Har du forsikring som gjelder de første 16 dagene av sykefraværet?",
            svar: {
              svar: "NEI",
              svarType: SvartypeDTO.JA_NEI,
            },
            shortName: ShortNameDTO.FORSIKRING,
          },
          {
            tekst:
              "Brukte du egenmelding eller noen annen sykmelding før datoen denne sykmeldingen gjelder fra?",
            svar: {
              svar: "JA",
              svarType: SvartypeDTO.JA_NEI,
            },
            shortName: ShortNameDTO.FRAVAER,
          },
          {
            tekst:
              "Hvilke dager var du borte fra jobb før datoen sykmeldingen gjelder fra?",
            shortName: ShortNameDTO.PERIODE,
            svar: {
              svarType: SvartypeDTO.PERIODER,
              svar: '[{"fom":"2020-02-24","tom":"2020-03-22"}]',
            },
          },
          {
            tekst: "Ny nærmeste leder?!",
            svar: {
              svar: "true",
              svarType: SvartypeDTO.JA_NEI,
            },
            shortName: ShortNameDTO.NY_NARMESTE_LEDER,
          },
          {
            tekst: "Velg dagene du brukte egenmelding",
            shortName: ShortNameDTO.EGENMELDINGSDAGER,
            svar: {
              svarType: SvartypeDTO.DAGER,
              svar: '["2023-03-06","2023-03-10","2023-03-07","2023-03-08","2023-03-11"]',
            },
          },
        ],
      },
    };
  };

export const mockSykmeldingWithKontaktMedPasient: SykmeldingNewFormatDTO = {
  ...mockSM,
  kontaktMedPasient: {
    kontaktDato: "2020-02-02T02:02:02.202Z",
    begrunnelseIkkeKontakt: "Ikke kontakt",
  },
};

export const mockSykmeldingerWithUtdypendeOpplysningerPkt62 =
  (): SykmeldingNewFormatDTO => {
    const map = new Map<string, SporsmalSvarDTO>();

    map.set("6.2.1", {
      sporsmal:
        "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
      svar: "Pkt. 6.2.1",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });
    map.set("6.2.2", {
      sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
      svar: "Pkt. 6.2.2",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });
    map.set("6.2.3", {
      sporsmal: "Har behandlingen frem til nå bedret arbeidsevnen?",
      svar: "Pkt. 6.2.3",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });
    map.set("6.2.4", {
      sporsmal:
        "Beskriv Pågående og planlagt henvisning, utredning og/eller behandling",
      svar: "Pkt. 6.2.4",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });

    return {
      ...mockSM,
      utdypendeOpplysninger: new Map<
        string,
        Map<string, SporsmalSvarDTO>
      >().set("6.2", map),
    };
  };

export const mockSykmeldingerWithUtdypendeOpplysningerPkt63 =
  (): SykmeldingNewFormatDTO => {
    const map = new Map<string, SporsmalSvarDTO>();

    map.set("6.3.1", {
      sporsmal:
        "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
      svar: "Pkt. 6.3.1",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });
    map.set("6.3.2", {
      sporsmal:
        "Beskriv pågående og planlagt henvisnng, utredning og/eller behandling. Lar dette seg kombinere med delvis arbeid?",
      svar: "Pkt. 6.3.2",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });

    return {
      ...mockSM,
      utdypendeOpplysninger: new Map<
        string,
        Map<string, SporsmalSvarDTO>
      >().set("6.3", map),
    };
  };

export const mockSykmeldingerWithUtdypendeOpplysningerPkt62SomeFieldsOmitted =
  (): SykmeldingNewFormatDTO => {
    const map = new Map<string, SporsmalSvarDTO>();

    map.set("6.2.1", {
      sporsmal:
        "Beskriv kort sykehistorie, symptomer og funn i dagens situasjon.",
      svar: "Pkt. 6.2.1",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });
    map.set("6.2.2", {
      sporsmal: "Hvordan påvirker sykdommen arbeidsevnen",
      svar: "Pkt. 6.2.2",
      restriksjoner: [SvarRestriksjonDTO.SKJERMET_FOR_ARBEIDSGIVER],
    });

    return {
      ...mockSM,
      utdypendeOpplysninger: new Map<
        string,
        Map<string, SporsmalSvarDTO>
      >().set("6.2", map),
    };
  };

export const mockSykmeldingerWithEgenmeldt: SykmeldingNewFormatDTO = {
  ...mockSM,
  egenmeldt: true,
};

export const mockSykmeldingerWithHarRedusertArbeidsgiverperiode: SykmeldingNewFormatDTO =
  {
    ...mockSM,
    harRedusertArbeidsgiverperiode: true,
  };

export const mockSykmeldingerWithPapirsykmelding: SykmeldingNewFormatDTO = {
  ...mockSM,
  papirsykmelding: true,
};
