export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  sykmeldingsgrad = "syfo.syfomodiaperson.sykmeldingsgrad",
  behandlersok = "syfo.dialogmote.behandlersok",
  virksomhetinput = "syfo.dialogmote.virksomhetinput",
}
