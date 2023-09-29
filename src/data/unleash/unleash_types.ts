export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isMeldingTypeMeldingFraNAVEnabled = "isMeldingTypeMeldingFraNAVEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
  isSendingAvForhandsvarselEnabled = "isSendingAvForhandsvarselEnabled",
  isHuskelappEnabled = "isHuskelappEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isMeldingTypeMeldingFraNAVEnabled: false,
  isMotebehovTilbakemeldingEnabled: false,
  isSendingAvForhandsvarselEnabled: false,
  isHuskelappEnabled: false,
};
