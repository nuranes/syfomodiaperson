import unleashClient = require("unleash-client");

const { initialize, Strategy } = unleashClient;

class ByDevEnhet extends Strategy {
  constructor() {
    super("byDevEnhet");
  }

  isEnabled(parameters: any, context: any) {
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.enheter.indexOf(context.valgtEnhet) !== -1;

    return valgtEnhetMatches && process.env.NAIS_CONTEXT === "dev";
  }
}

class ByProdEnhet extends Strategy {
  constructor() {
    super("byProdEnhet");
  }

  isEnabled(parameters: any, context: any) {
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.enheter.indexOf(context.valgtEnhet) !== -1;

    return valgtEnhetMatches && process.env.NAIS_CONTEXT === "prod";
  }
}

class ByUserId extends Strategy {
  constructor() {
    super("byUserId");
  }

  isEnabled(parameters: any, context: any) {
    if (!context.user) {
      return false;
    }

    return parameters.user.indexOf(context.user) !== -1;
  }
}

class ByEnvironment extends Strategy {
  constructor() {
    super("byEnvironmentToggle");
  }

  isEnabled(parameters: any) {
    return (
      (parameters.dev === "true" && process.env.NAIS_CONTEXT === "dev") ||
      (parameters.prod === "true" && process.env.NAIS_CONTEXT === "prod")
    );
  }
}

const unleash = initialize({
  url: "https://unleash.nais.io/api/",
  appName: "syfomodiaperson",
  environment: process.env.NAIS_CONTEXT,
  strategies: [
    new ByDevEnhet(),
    new ByUserId(),
    new ByProdEnhet(),
    new ByEnvironment(),
  ],
});

export const unleashToggles = (toggles: any, valgtEnhet: any, userId: any) => {
  return {
    "syfo.dialogmote.virksomhetinput": unleash.isEnabled(
      "syfo.dialogmote.virksomhetinput",
      {
        valgtEnhet: valgtEnhet,
        user: userId,
      }
    ),
    "syfo.kandidat.unntaksstatistikk": unleash.isEnabled(
      "syfo.kandidat.unntaksstatistikk",
      {
        valgtEnhet: valgtEnhet,
        user: userId,
      }
    ),
    "syfo.behandlerdialog": unleash.isEnabled("syfo.behandlerdialog", {
      valgtEnhet: valgtEnhet,
      user: userId,
    }),
    "syfo.gradgraf.diagnosekode": unleash.isEnabled(
      "syfo.gradgraf.diagnosekode",
      {
        valgtEnhet: valgtEnhet,
        user: userId,
      }
    ),
  };
};
