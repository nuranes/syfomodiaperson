export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isMeldingTypeMeldingFraNAVEnabled = "isMeldingTypeMeldingFraNAVEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isMeldingTypeMeldingFraNAVEnabled: false,
  isMotebehovTilbakemeldingEnabled: false,
};
