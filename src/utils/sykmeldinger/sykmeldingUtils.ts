import { senesteTom, tidligsteFom } from "../periodeUtils";
import {
  ArbeidssituasjonType,
  SykmeldingOldFormat,
  SykmeldingPeriodeDTO,
  SykmeldingStatus,
} from "@/data/sykmelding/types/SykmeldingOldFormat";
import { manederMellomDatoer } from "@/utils/datoUtils";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export const finnAvventendeSykmeldingTekst = (
  sykmelding: SykmeldingOldFormat
): string | undefined => {
  const avventendePeriode =
    sykmelding.mulighetForArbeid.perioder &&
    sykmelding.mulighetForArbeid.perioder.find((periode) => {
      return !!periode.avventende;
    });
  return avventendePeriode?.avventende;
};

export const erBehandlingsdagerEllerReisetilskudd = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.mulighetForArbeid.perioder &&
    sykmelding.mulighetForArbeid.perioder.find((periode) => {
      return !!periode.reisetilskudd || !!periode.behandlingsdager;
    });
  return !!erEkstraInformasjon;
};

export const erEkstraDiagnoseInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.diagnose &&
    (sykmelding.diagnose.fravaersgrunnLovfestet ||
      sykmelding.diagnose.svangerskap ||
      sykmelding.diagnose.yrkesskade);
  return !!erEkstraInformasjon;
};

export const erMulighetForArbeidInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.mulighetForArbeid &&
    ((sykmelding.mulighetForArbeid.aktivitetIkkeMulig433 &&
      sykmelding.mulighetForArbeid.aktivitetIkkeMulig433.length > 0) ||
      sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig433 ||
      (sykmelding.mulighetForArbeid.aktivitetIkkeMulig434 &&
        sykmelding.mulighetForArbeid.aktivitetIkkeMulig434.length > 0) ||
      sykmelding.mulighetForArbeid.aarsakAktivitetIkkeMulig434);
  return !!erEkstraInformasjon;
};

export const erFriskmeldingInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.friskmelding &&
    (sykmelding.friskmelding.antarReturSammeArbeidsgiver ||
      sykmelding.friskmelding.antarReturAnnenArbeidsgiver ||
      sykmelding.friskmelding.tilbakemeldingReturArbeid ||
      sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid ||
      sykmelding.friskmelding.utenArbeidsgiverTilbakemelding);
  return !!erEkstraInformasjon;
};

export const erArbeidsforEtterPerioden = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.friskmelding && sykmelding.friskmelding.arbeidsfoerEtterPerioden;
  return !!erEkstraInformasjon;
};

export const erHensynPaaArbeidsplassenInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.friskmelding && sykmelding.friskmelding.hensynPaaArbeidsplassen;
  return !!erEkstraInformasjon;
};

export const erBedringAvArbeidsevnenInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const erEkstraInformasjon =
    sykmelding.arbeidsevne &&
    (sykmelding.arbeidsevne.tilretteleggingArbeidsplass ||
      sykmelding.arbeidsevne.tiltakNAV ||
      sykmelding.arbeidsevne.tiltakAndre);
  return !!erEkstraInformasjon;
};

export const erMeldingTilNavInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  return (
    !!sykmelding.meldingTilNav.navBoerTaTakISaken ||
    !!sykmelding.meldingTilNav.navBoerTaTakISakenBegrunnelse
  );
};

export const erMeldingTilArbeidsgiverInformasjon = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  return !!sykmelding.innspillTilArbeidsgiver;
};

export const erUtdypendeOpplysninger = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  const utdypendeOpplysninger = sykmelding.utdypendeOpplysninger;
  return (
    (utdypendeOpplysninger && Object.keys(utdypendeOpplysninger).length > 0) ||
    false
  );
};

export const erEkstraInformasjonISykmeldingen = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  return (
    erEkstraDiagnoseInformasjon(sykmelding) ||
    erMulighetForArbeidInformasjon(sykmelding) ||
    erFriskmeldingInformasjon(sykmelding) ||
    erArbeidsforEtterPerioden(sykmelding) ||
    erHensynPaaArbeidsplassenInformasjon(sykmelding) ||
    erUtdypendeOpplysninger(sykmelding) ||
    erBedringAvArbeidsevnenInformasjon(sykmelding) ||
    erMeldingTilNavInformasjon(sykmelding) ||
    erMeldingTilArbeidsgiverInformasjon(sykmelding) ||
    erBehandlingsdagerEllerReisetilskudd(sykmelding)
  );
};

export const arbeidsgivernavnEllerArbeidssituasjon = (
  sykmelding: SykmeldingOldFormat
): string => {
  if (
    sykmelding.innsendtArbeidsgivernavn &&
    sykmelding.innsendtArbeidsgivernavn.length > 0
  ) {
    return sykmelding.innsendtArbeidsgivernavn;
  }

  switch (sykmelding.sporsmal.arbeidssituasjon) {
    case ArbeidssituasjonType.ARBEIDSLEDIG:
      return "Ingen arbeidsgiver";
    case ArbeidssituasjonType.NAERINGSDRIVENDE:
      return "Selvstendig næringsdrivende";
    case ArbeidssituasjonType.FRILANSER:
      return "Frilanser";
    default:
      return "Annet";
  }
};

export const sykmeldingerMedStatusSendt = (
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] => {
  return sykmeldinger.filter(
    (sykmelding) => sykmelding.status === SykmeldingStatus.SENDT
  );
};

export const sykmeldingerUtenArbeidsgiver = (
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] => {
  return sykmeldinger.filter((sykmelding) =>
    erSykmeldingUtenArbeidsgiver(sykmelding)
  );
};

export const erSykmeldingUtenArbeidsgiver = (
  sykmelding: SykmeldingOldFormat
): boolean => {
  return (
    !sykmelding.orgnummer && sykmelding.status === SykmeldingStatus.BEKREFTET
  );
};

export const sykmeldingperioderSortertEldstTilNyest = (
  perioder: SykmeldingPeriodeDTO[]
): SykmeldingPeriodeDTO[] => {
  return perioder.sort((periode1, periode2) => {
    return periode1.fom > periode2.fom
      ? 1
      : periode1.fom < periode2.fom
      ? -1
      : 0;
  });
};

export const getSykmeldingStartdato = (
  sykmelding: SykmeldingOldFormat
): Date => {
  const perioder = sykmelding.mulighetForArbeid.perioder;
  return new Date(sykmeldingperioderSortertEldstTilNyest(perioder)[0].fom);
};

export const newAndActivatedSykmeldinger = (
  sykmeldinger: SykmeldingOldFormat[]
) => {
  return sykmeldinger.filter((sykmelding) => {
    return (
      sykmelding.status === SykmeldingStatus.BEKREFTET ||
      sykmelding.status === SykmeldingStatus.SENDT ||
      sykmelding.status === SykmeldingStatus.NY
    );
  });
};

export const sykmeldingerInnenforOppfolgingstilfelle = (
  sykmeldinger: SykmeldingOldFormat[],
  oppfolgingstilfelle?: OppfolgingstilfelleDTO
): SykmeldingOldFormat[] => {
  if (!oppfolgingstilfelle) {
    return [];
  }
  return sykmeldinger.filter((sykmelding) => {
    const sykmeldingStart = dayjs(getSykmeldingStartdato(sykmelding));
    const oppfolgingstilfelleStart = dayjs(oppfolgingstilfelle.start);
    const oppfolgingstilfelleEnd = dayjs(oppfolgingstilfelle.end);

    dayjs.extend(isSameOrAfter);
    return (
      sykmeldingStart.isSameOrAfter(oppfolgingstilfelleStart, "day") &&
      oppfolgingstilfelleEnd.isSameOrAfter(sykmeldingStart, "day")
    );
  });
};

export function sykmeldingerSortertNyestTilEldstPeriode(
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] {
  return sykmeldinger.sort((sykmelding1, sykmelding2) => {
    if (
      sykmelding1.mulighetForArbeid.perioder.length > 0 &&
      sykmelding2.mulighetForArbeid.perioder.length > 0
    ) {
      const dato1 = new Date(
        tidligsteFom(sykmelding1.mulighetForArbeid.perioder)
      );
      const dato2 = new Date(
        tidligsteFom(sykmelding2.mulighetForArbeid.perioder)
      );
      return dato1 > dato2 ? -1 : 1;
    }
    return 0;
  });
}

interface SykmeldingerPerVirksomhet {
  [virksomhetsnummer: string]: SykmeldingOldFormat[];
}

export const sykmeldingerGruppertEtterVirksomhet = (
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingerPerVirksomhet => {
  return sykmeldinger.reduce((memo: SykmeldingerPerVirksomhet, sykmelding) => {
    const virksomhetsnummer =
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer;
    const memo2 = { ...memo };
    if (virksomhetsnummer) {
      if (!memo2[virksomhetsnummer]) {
        memo2[virksomhetsnummer] = [];
      }
      memo2[virksomhetsnummer] = [...memo2[virksomhetsnummer], sykmelding];
    }
    return memo2;
  }, {});
};

const sykmeldingperioderMedGradering = (
  sykmeldingperioder: SykmeldingPeriodeDTO[]
) => {
  return sykmeldingperioder.filter((periode) => {
    return !!periode.grad;
  });
};

export const stringMedAlleGraderingerFraSykmeldingPerioder = (
  sykmeldingPerioderSortertEtterDato: SykmeldingPeriodeDTO[]
): string => {
  const perioderMedGradering = sykmeldingperioderMedGradering(
    sykmeldingPerioderSortertEtterDato
  );
  const stringMedAlleGraderinger = perioderMedGradering
    .map((periode) => {
      return periode.grad;
    })
    .join("% - ");

  return stringMedAlleGraderinger ? `${stringMedAlleGraderinger}%` : "";
};

const isSykmeldingActiveToday = (sykmelding: SykmeldingOldFormat): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    tidligsteFom(sykmelding.mulighetForArbeid.perioder) <= today &&
    today <= senesteTom(sykmelding.mulighetForArbeid.perioder)
  );
};

export const activeSykmeldingerSentToArbeidsgiver = (
  sykmeldinger: SykmeldingOldFormat[]
): SykmeldingOldFormat[] => {
  return sykmeldinger.filter((sykmelding) => {
    return (
      sykmelding.status === SykmeldingStatus.SENDT &&
      isSykmeldingActiveToday(sykmelding)
    );
  });
};

export const latestSykmeldingForVirksomhet = (
  sykmeldinger: SykmeldingOldFormat[],
  virksomhetsnummer: string
): SykmeldingOldFormat => {
  const sykmeldingerForVirksomhet = sykmeldinger.filter(
    (sykmelding) =>
      sykmelding.mottakendeArbeidsgiver?.virksomhetsnummer === virksomhetsnummer
  );

  return sykmeldingerSortertNyestTilEldstPeriode(sykmeldingerForVirksomhet)[0];
};

export const skalVisesSomAktivSykmelding = (sykmld: SykmeldingOldFormat) =>
  sykmld.status === SykmeldingStatus.NY &&
  manederMellomDatoer(
    senesteTom(sykmld.mulighetForArbeid.perioder),
    new Date()
  ) < 3;

export const skalVisesSomTidligereSykmelding = (sykmld: SykmeldingOldFormat) =>
  sykmld.status !== SykmeldingStatus.NY ||
  manederMellomDatoer(
    senesteTom(sykmld.mulighetForArbeid.perioder),
    new Date()
  ) >= 3;

export const getDiagnosekodeFromLatestSykmelding = (
  sykmeldinger: SykmeldingOldFormat[]
) => {
  const latestSykmelding =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldinger)[0];
  const latestDiagnosekode =
    latestSykmelding?.diagnose?.hoveddiagnose?.diagnosekode;

  return latestDiagnosekode || "";
};
