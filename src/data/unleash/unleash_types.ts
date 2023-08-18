export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  virksomhetinput = "syfo.dialogmote.virksomhetinput",
  behandlerdialogLegeerklaring = "syfo.behandlerdialog.legeerklaring",
  behandlerdialogReturLegeerklaring = "syfo.behandlerdialog.returlegeerklaring",
  vurderMotebehovTilbakemelding = "syfo.motebehov.tilbakemelding",
}
