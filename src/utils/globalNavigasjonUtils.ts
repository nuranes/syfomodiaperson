import { harUbehandletMotebehov } from "./motebehovUtils";
import {
  activeLPSOppfolgingsplaner,
  activeOppfolgingsplaner,
} from "./oppfolgingsplanerUtils";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { OppfolgingsplanLPSMedPersonoppgave } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import {
  getAllUbehandledePersonOppgaver,
  hasUbehandletPersonoppgave,
  numberOfUbehandledePersonOppgaver,
} from "@/utils/personOppgaveUtils";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";

const getNumberOfMoteOppgaver = (
  motebehov: MotebehovVeilederDTO[],
  personOppgaver: PersonOppgave[]
): number => {
  const numberOfUbehandledeMotebehov = harUbehandletMotebehov(motebehov)
    ? 1
    : 0;
  const numberOfUbehandledeDialogmotesvar = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.DIALOGMOTESVAR
  )
    ? 1
    : 0;
  return numberOfUbehandledeMotebehov + numberOfUbehandledeDialogmotesvar;
};

const numberOfActiveOppfolgingsplaner = (
  oppfolgingsplaner: OppfolgingsplanDTO[]
) => {
  return activeOppfolgingsplaner(oppfolgingsplaner).length;
};

const numberOfActiveLPSOppfolgingsplaner = (
  oppfolgingsplanerLps: OppfolgingsplanLPSMedPersonoppgave[]
) => {
  return activeLPSOppfolgingsplaner(oppfolgingsplanerLps).length;
};

const getNumberOfAktivitetskravOppgaver = (
  aktivitetskrav: AktivitetskravDTO[],
  personOppgaver: PersonOppgave[]
) => {
  const newAktivitetskrav = aktivitetskrav.find((krav) => {
    return krav.status === AktivitetskravStatus.NY;
  });
  const hasUbehandletOppgaveVurderStans = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.AKTIVITETSKRAV_VURDER_STANS
  );

  return newAktivitetskrav || hasUbehandletOppgaveVurderStans ? 1 : 0;
};

const getNumberOfBehandlerDialogOppgaver = (
  personOppgaver: PersonOppgave[]
) => {
  const numberOfUbehandledeBehandlerDialogSvar = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_SVAR
  )
    ? 1
    : 0;
  const numberOfUbehandledeBehandlerDialogUbesvart = hasUbehandletPersonoppgave(
    personOppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART
  )
    ? 1
    : 0;

  const numberOfUbehanldedeBehandlerDialogMeldingAvvist =
    hasUbehandletPersonoppgave(
      personOppgaver,
      PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST
    )
      ? 1
      : 0;

  return (
    numberOfUbehandledeBehandlerDialogSvar +
    numberOfUbehandledeBehandlerDialogUbesvart +
    numberOfUbehanldedeBehandlerDialogMeldingAvvist
  );
};

const getNumberOfBehandlerBerOmBistandOppgaver = (
  personoppgaver: PersonOppgave[]
): number => {
  return getAllUbehandledePersonOppgaver(
    personoppgaver,
    PersonOppgaveType.BEHANDLER_BER_OM_BISTAND
  ).length;
};

const getNumberOfArbeidsuforhetOppgaver = (
  personoppgaver: PersonOppgave[]
): number => {
  return getAllUbehandledePersonOppgaver(
    personoppgaver,
    PersonOppgaveType.ARBEIDSUFORHET_VURDER_AVSLAG
  ).length;
};

export const numberOfTasks = (
  menypunkt: Menypunkter,
  motebehov: MotebehovVeilederDTO[],
  oppfolgingsplaner: OppfolgingsplanDTO[],
  personOppgaver: PersonOppgave[],
  oppfolgingsplanerlps: OppfolgingsplanLPSMedPersonoppgave[],
  aktivitetskrav: AktivitetskravDTO[]
): number => {
  switch (menypunkt) {
    case Menypunkter.DIALOGMOTE:
      return getNumberOfMoteOppgaver(motebehov, personOppgaver);
    case Menypunkter.OPPFOELGINGSPLANER:
      return (
        numberOfActiveOppfolgingsplaner(oppfolgingsplaner) +
        numberOfActiveLPSOppfolgingsplaner(oppfolgingsplanerlps) +
        numberOfUbehandledePersonOppgaver(
          personOppgaver,
          PersonOppgaveType.OPPFOLGINGSPLANLPS
        )
      );
    case Menypunkter.AKTIVITETSKRAV:
      return getNumberOfAktivitetskravOppgaver(aktivitetskrav, personOppgaver);
    case Menypunkter.BEHANDLERDIALOG:
      return getNumberOfBehandlerDialogOppgaver(personOppgaver);
    case Menypunkter.SYKMELDINGER:
      return getNumberOfBehandlerBerOmBistandOppgaver(personOppgaver);
    case Menypunkter.ARBEIDSUFORHET:
      return getNumberOfArbeidsuforhetOppgaver(personOppgaver);
    case Menypunkter.FRISKTILARBEID:
    case Menypunkter.NOKKELINFORMASJON:
    case Menypunkter.SYKEPENGESOKNADER:
    case Menypunkter.VEDTAK:
    case Menypunkter.HISTORIKK: {
      return 0;
    }
  }
};
