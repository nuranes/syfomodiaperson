import unleashClient = require("unleash-client");
import { Strategy } from "unleash-client";
import Config = require("./config");

const { initialize } = unleashClient;

export type Toggles = {
  [key in ToggleNames]: boolean;
};

// See toggles: https://teamsykefravr-unleash-web.nav.cloud.nais.io/features
export enum ToggleNames {
  isVirksomhetsinputEnabled = "isVirksomhetsinputEnabled",
  isMeldingTypeMeldingFraNAVEnabled = "isMeldingTypeMeldingFraNAVEnabled",
  isMotebehovTilbakemeldingEnabled = "isMotebehovTilbakemeldingEnabled",
  isSendingAvForhandsvarselEnabled = "isSendingAvForhandsvarselEnabled",
}

class VeilederIds extends Strategy {
  constructor() {
    super("VeilederIds");
  }

  isEnabled(parameters, context) {
    return parameters.veilederId.indexOf(context.veilederId) !== -1;
  }
}

class EnhetIds extends Strategy {
  constructor() {
    super("EnhetIds");
  }

  isEnabled(parameters, context) {
    return parameters.enhetId.indexOf(context.enhetId) !== -1;
  }
}

export const unleash = initialize({
  url: Config.unleash.serverApiUrl + "/api",
  appName: "syfomodiaperson",
  customHeaders: { Authorization: Config.unleash.serverApiToken },
  strategies: [new VeilederIds(), new EnhetIds()],
});

export const getToggles = (veilederId, enhetId) => {
  const context = {
    veilederId: veilederId,
    enhetId: enhetId,
  };
  return {
    isVirksomhetsinputEnabled: unleash.isEnabled(
      "isVirksomhetsinputEnabled",
      context
    ),
    isMeldingTypeMeldingFraNAVEnabled: unleash.isEnabled(
      "isMeldingTypeMeldingFraNAVEnabled",
      context
    ),
    isMotebehovTilbakemeldingEnabled: unleash.isEnabled(
      "isMotebehovTilbakemeldingEnabled",
      context
    ),
    isSendingAvForhandsvarselEnabled: unleash.isEnabled(
      "isSendingAvForhandsvarselEnabled",
      context
    ),
  };
};
