export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  virksomhetinput = "syfo.dialogmote.virksomhetinput",
  behandlerdialog = "syfo.behandlerdialog",
  behandlerdialogPaminnelse = "syfo.behandlerdialog.paminnelse",
}
