export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See https://unleash.nais.io/#/features (syfomodiaperson)
export enum ToggleNames {
  virksomhetinput = "syfo.dialogmote.virksomhetinput",
  unntaksstatistikk = "syfo.kandidat.unntaksstatistikk",
  behandlerdialog = "syfo.behandlerdialog",
  aktivitetskravVurderingFrist = "syfo.aktivitetskrav.vurdering.frist",
  gradgrafDiagnosekode = "syfo.gradgraf.diagnosekode",
}
