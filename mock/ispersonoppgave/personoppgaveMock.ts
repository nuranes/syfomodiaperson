import {
  ARBEIDSTAKER_DEFAULT,
  VEILEDER_IDENT_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import dayjs from "dayjs";
import { PersonOppgaveType } from "../../src/data/personoppgave/types/PersonOppgave";
import { meldingUuids } from "../isbehandlerdialog/behandlerdialogMock";
import { varselUuid } from "../isaktivitetskrav/aktivitetskravMock";

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

const personOppgaveUbehandletVurderStans = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2625-061b-443d-ae1f-3b08e9574cd1",
  referanseUuid: varselUuid,
  type: "AKTIVITETSKRAV_VURDER_STANS",
};

const personOppgaveUbehandletDialogmotesvar = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd1",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
  type: "DIALOGMOTESVAR",
};

export const personOppgaveUbehandletBehandlerdialogAvvistMelding = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574ca2",
  referanseUuid: meldingUuids.avvistMelding,
  type: PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST,
};

export const personOppgaveBehandletBehandlerdialogAvvistMelding = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574ca2",
  referanseUuid: meldingUuids.avvistMelding2,
  type: PersonOppgaveType.BEHANDLERDIALOG_MELDING_AVVIST,
  behandletTidspunkt: new Date().toDateString(),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
};

export const personOppgaveUbehandletBehandlerdialogSvar = {
  ...personOppgaveUbehandletDialogmotesvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd4",
  referanseUuid: meldingUuids.tilleggopplysningerInnkommende,
  type: "BEHANDLERDIALOG_SVAR",
};

export const personOppgaveBehandletBehandlerdialogSvar = {
  ...personOppgaveUbehandletBehandlerdialogSvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd8",
  referanseUuid: meldingUuids.legeerklaringInnkommende,
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
};

export const personOppgaveUbehandletBehandlerdialogUbesvartMelding = {
  ...personOppgaveUbehandletBehandlerdialogSvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9234cd4",
  referanseUuid: meldingUuids.ubesvartMelding,
  type: "BEHANDLERDIALOG_MELDING_UBESVART",
};

export const personOppgaveBehandletBehandlerdialogUbesvartMelding = {
  ...personOppgaveUbehandletBehandlerdialogUbesvartMelding,
  uuid: "5f1e2629-063b-442d-ae1g-3b08e9234cd4",
  referanseUuid: meldingUuids.tilleggsopplysningerUtgaaende,
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
};

const personOppgaveBehandletOppfolgingsplanLPS = {
  ...personOppgaveUbehandletOppfolgingsplanLPS,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd6",
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  opprettet: new Date(dayjs().subtract(10, "days").toJSON()).toDateString(),
};

export const personOppgaveBehandletDialogmotesvar = {
  ...personOppgaveUbehandletDialogmotesvar,
  uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
  referanseUuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd7",
  behandletTidspunkt: new Date(
    dayjs().subtract(1, "days").toJSON()
  ).toDateString(),
  behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
  opprettet: new Date(dayjs().subtract(10, "days").toJSON()).toDateString(),
};

export const makePersonOppgaveBehandlet = (ubehandletPersonOppgave) => {
  return {
    ...ubehandletPersonOppgave,
    behandletTidspunkt: new Date(
      dayjs().subtract(1, "days").toJSON()
    ).toDateString(),
    behandletVeilederIdent: VEILEDER_IDENT_DEFAULT,
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
    personOppgaveUbehandletBehandlerdialogUbesvartMelding,
    personOppgaveBehandletBehandlerdialogUbesvartMelding,
    personOppgaveUbehandletBehandlerdialogAvvistMelding,
    personOppgaveBehandletBehandlerdialogAvvistMelding,
    personOppgaveUbehandletVurderStans,
  ];
};
