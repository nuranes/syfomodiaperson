import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import dayjs from "dayjs";

const personOppgaveUbehandletOppfolgingsplanLPS = {
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd0",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd5",
  fnr: ARBEIDSTAKER_DEFAULT.personIdent,
  virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
  type: "OPPFOLGINGSPLANLPS",
  behandletTidspunkt: null,
  behandletVeilederIdent: null,
  opprettet: new Date().toDateString(),
};

const personOppgaveUbehandletDialogmotesvar = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
  type: "DIALOGMOTESVAR",
};

export const personOppgaveUbehandletBehandlerdialogSvar = {
  ...personOppgaveUbehandletDialogmotesvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd4",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd5",
  type: "BEHANDLERDIALOG_SVAR",
};

export const personOppgaveBehandletBehandlerdialogSvar = {
  ...personOppgaveUbehandletBehandlerdialogSvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd8",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd9",
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: "Z991100",
};

const personOppgaveBehandletOppfolgingsplanLPS = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd6",
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: "Z991100",
  opprettet: new Date(dayjs().subtract(10, "days").toJSON()).toDateString(),
};

const personOppgaveBehandletDialogmotesvar = {
  ...personOppgaveUbehandletDialogmotesvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd7",
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: "Z991100",
  opprettet: new Date(dayjs().subtract(10, "days").toJSON()).toDateString(),
};

export const makePersonOppgaveBehandlet = (ubehandletPersonOppgave) => {
  return {
    ...ubehandletPersonOppgave,
    behandletTidspunkt: new Date(
      dayjs().subtract(1, "days").toJSON()
    ).toDateString(),
    behandletVeilederIdent: "Z991100",
    opprettet: new Date(dayjs().subtract(10, "days").toJSON()).toDateString(),
  };
};

export const personoppgaverMock = () => {
  return [
    personOppgaveUbehandletOppfolgingsplanLPS,
    personOppgaveUbehandletDialogmotesvar,
    personOppgaveBehandletOppfolgingsplanLPS,
    personOppgaveBehandletDialogmotesvar,
    personOppgaveBehandletBehandlerdialogSvar,
    personOppgaveUbehandletBehandlerdialogSvar,
  ];
};
