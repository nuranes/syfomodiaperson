import unleashClient = require("unleash-client");

const { initialize, Strategy } = unleashClient;

class ByEnhetAndEnvironment extends Strategy {
  constructor() {
    super("byEnhetAndEnvironment");
  }

  isEnabled(parameters: any, context: any) {
    if (process.env.NAIS_CONTEXT === "dev") {
      return true;
    }
    if (!context.valgtEnhet) {
      return false;
    }

    const valgtEnhetMatches =
      parameters.valgtEnhet.indexOf(context.valgtEnhet) !== -1;
    const environmentEnabled = parameters.tilgjengeligIProd === "true";

    return valgtEnhetMatches && environmentEnabled;
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

const unleash = initialize({
  url: "https://unleash.nais.io/api/",
  appName: "syfomodiaperson",
  environment: process.env.NAIS_CONTEXT,
  strategies: [new ByEnhetAndEnvironment(), new ByUserId()],
});

export const unleashToggles = (toggles: any, valgtEnhet: any, userId: any) => {
  return {
    "syfo.syfomodiaperson.sykmeldingsgrad": unleash.isEnabled(
      "syfo.syfomodiaperson.sykmeldingsgrad",
      {
        valgtEnhet: valgtEnhet,
        user: userId,
      }
    ),

    "syfo.dialogmote.virksomhetinput": unleash.isEnabled(
      "syfo.dialogmote.virksomhetinput",
      {
        valgtEnhet: valgtEnhet,
        user: userId,
      }
    ),
  };
};
