export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isMeldingsTypeMeldingFraNAVEnabled = "isMeldingsTypeMeldingFraNAVEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isMeldingsTypeMeldingFraNAVEnabled: false,
  isMotebehovTilbakemeldingEnabled: false,
};
