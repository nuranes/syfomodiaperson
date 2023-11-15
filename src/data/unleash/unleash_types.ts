export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isSendingAvForhandsvarselEnabled = "isSendingAvForhandsvarselEnabled",
  isHuskelappEnabled = "isHuskelappEnabled",
}

export const defaultToggles: Toggles = {
  isVirksomhetsinputEnabled: false,
  isSendingAvForhandsvarselEnabled: false,
  isHuskelappEnabled: false,
};
