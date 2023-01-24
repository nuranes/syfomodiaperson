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
  hasUbehandletPersonOppgaveDialogmotesvar,
  isBehandletOppgave,
} from "@/utils/personOppgaveUtils";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";

const getNumberOfMoteOppgaver = (
  motebehov: MotebehovVeilederDTO[],
  personOppgaver: PersonOppgave[]
): number => {
  const numberOfUbehandledeMotebehov = harUbehandletMotebehov(motebehov)
    ? 1
    : 0;
  const numberOfUbehandledeDialogmotesvar =
    hasUbehandletPersonOppgaveDialogmotesvar(personOppgaver) ? 1 : 0;
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

const numberOfUnprocessedPersonOppgaver = (
  personOppgaver: PersonOppgave[],
  type: string
) => {
  return personOppgaver.filter((personoppgave) => {
    return personoppgave.type === type && !isBehandletOppgave(personoppgave);
  }).length;
};

const getNumberOfAktivitetskravOppgaver = (
  aktivitetskrav: AktivitetskravDTO[]
) => {
  const newAktivitetskrav = aktivitetskrav.find((krav) => {
    return krav.status === AktivitetskravStatus.NY;
  });

  return newAktivitetskrav ? 1 : 0;
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
        numberOfUnprocessedPersonOppgaver(
          personOppgaver,
          PersonOppgaveType.OPPFOLGINGSPLANLPS
        )
      );
    case Menypunkter.AKTIVITETSKRAV:
      return getNumberOfAktivitetskravOppgaver(aktivitetskrav);
    default:
      return 0;
  }
};
