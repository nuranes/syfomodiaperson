import dotenv = require("dotenv");

dotenv.config();

const hasEnvVar = (name: any) => {
  return process.env[name] !== undefined;
};

interface EnvVarType {
  name: any;
  defaultValue?: any;
}

const envVar = ({ name, defaultValue }: EnvVarType): any => {
  const fromEnv = process.env[name];
  if (fromEnv) {
    return fromEnv;
  }
  if (typeof defaultValue === "string") {
    return defaultValue;
  } else if (typeof defaultValue === "object") {
    if (isDev && typeof defaultValue.dev === "string") {
      return defaultValue.dev;
    }
    if (isProd && typeof defaultValue.prod === "string") {
      return defaultValue.prod;
    }
  }
  throw new Error(`Missing required environment variable ${name}`);
};

export const isDev = envVar({ name: "NODE_ENV" }) === "development";
export const isProd = envVar({ name: "NODE_ENV" }) === "production";

// Config used internally in the server
export const server = {
  host: envVar({ name: "HOST", defaultValue: "localhost" }),
  port: Number.parseInt(envVar({ name: "PORT", defaultValue: "8080" })),
  sessionKey: envVar({ name: "SESSION_KEY" }),
  sessionCookieName: envVar({
    name: "SESSION_COOKIE_NAME",
    defaultValue: "isso-idtoken-v2",
  }),
  logLevel: envVar({ name: "LOG_LEVEL", defaultValue: "info" }),
};

export interface ExternalAppConfig {
  applicationName: string;
  clientId: string;
  host: string;
  tokenSetId?: any;
  removePathPrefix?: boolean;
}

// For auth
export const auth = {
  discoverUrl: envVar({
    name: "AZURE_APP_WELL_KNOWN_URL",
    defaultValue: {
      dev: "",
    },
  }),
  jwksUri: envVar({
    name: "AZURE_OPENID_CONFIG_JWKS_URI",
    defaultValue: {
      dev: "",
    },
  }),
  clientId: envVar({
    name: "AZURE_APP_CLIENT_ID",
    defaultValue: { dev: "syfomodiaperson" },
  }),
  jwks: hasEnvVar("AZURE_APP_JWKS")
    ? JSON.parse(envVar({ name: "AZURE_APP_JWKS" }))
    : // Generert med https://mkjwk.org/ (key size: 2048, key use: signature, algorithm: RS256, key id: sha-256)
      {
        keys: [
          {
            p: "5m7Jqtqf_fo_5B6T8WfBkJqB5lSRlhR7t5uQ0-M9S0fwa1_MUgjOKecUdwg6iFkX4fxNNYq1y_RcTMngeHZX_7w9_lOZ3qB6PKxE9G1rNzZMu_athRecbOTGUzqyfG-2CIVUGAXPszjzYtTlRx8CG90tKpCurIfb0hquunsfqG0",
            kty: "RSA",
            q: "qEFXs7PiQQGlzL78SZAwEk53YWegL-p3Pjsm57O_pTGu2JHVoOwcRmY6VpDBca51z-HiupCbhs2Lbc2MGO_xrPJqkIJ_yvywnizX9O5JWzkMd7qIJDyw9tcuof9EQlmBr0_xXbCQ19N_sBkZRWa_uXs3iujfAGD0DzNorqd6bJ0",
            d: "jXJ-8KhehKPIzCtcU0uuyC145mD7W_OS7J4VILZBAmxnUs4aJZmx_Vv8PGqjC0Is9z5gajanpbrdIH9nBC-jhKkovhpZ5ipceLPbiQx5CFsK0bXcGVBrlh6gWcJiyCZ0VrM6ogMu6hnuY4NCv7z3XFhp5kj3EyraPpt1fLee_JGrpn1iyiXaerHvWfn0lIbJU3ppmCfF9iX-7Ky9SvHNoNmL-aFd_pp9BmBLmL4sTHk6SwCJoS9Bjg_MWosMlP8kjk4YfouUwiCPgcDAhhj0PgFxVI2O4YUPcQEe4KYacAhk7k130WJGeslCQ7-n-ftVaYKskQgO0Vyni-8u7oTbgQ",
            e: "AQAB",
            use: "sig",
            kid: "wO_HE0jAZzwKF8WdE4p3NorrJ2b_CQrju7tzTAP2Ayc",
            qi: "sumvcvFirOmVjS_Mf6e3qllltr-5gcNfrlFK2giVKaeplXNVxP6FgeCSilg5XldBQdugJJ42kJooZ3_5EmphtfgHX9RusSGoYgkiRzTOTHtuN9wYG5_oHv6hSQJFaYwM59gRhGSi6dpNY9y3Td9i8N713-56FHTaTGHHiOqwt94",
            dp: "tfFP5klM_lozTEkggwFrgmOcoWKwuRFfRe_dAJBx-xjIKd-wEi3Fqqw8Kmgi3zmJc_OketwVAv7kSfUz-alnfhMB1-fmnDOVkIZsw5oJh8Sl_dud0nJ8HjbcqSa1ey8xSbUMWxNrlZUoBycWCXvgTGPsn6kxYiS7Wj-bKr7Allk",
            alg: "RS256",
            dq: "IktfQuORZEqfrsHmzl-zTKftsU7b2ahisa6A2Y1LrLIZv07KSkiV4suHbImIxFEY9kxGWFyNNsbCepkAyzxs-CFZEydmQMuMfFELm4LONOfF4MmGYkx0jXuCp8ZN9XAk_MTAn6YTf8o-JniXLAwrW_T_dzLL8VnRpR-HYMIGNAk",
            n: "l3OFarvFs2MQOk3c3JmFjcDEBd0CKXxMSfM5x6J0NVLrnqev6btfWytNse8RMIFBc_w3tnw1yb0o1bnVQOf5htywbgdCwRSFlXc8DBQ35doAyhlrkcTuQqCiLkCyUTY5NEMgLTp1OzonrCgthIhYK_cPFboxK2e_ZT1II8otylbp93iA84a3LGYVj-AgQuhb6wfKGtL5aiug9nPrEVinnGqv3VhNf5uwlOZ77UbQSGvlNnc59ZzAump3R8mdnM8m1TcOxae2c-8Ru00rgNF9r4OxZFCLPsVQJvaY0XTmshNNH-4OJmAbjHcTpzwyfUWyCDlv_pvC5fuD6-paPGpG2Q",
          },
        ],
      },

  redirectUri: envVar({ name: "AUTH_REDIRECT_URI" }),

  tokenEndpointAuthMethod: "private_key_jwt",
  responseType: "code",
  responseMode: "query",
  tokenEndpointAuthSigningAlg: "RS256",

  internarbeidsflatedecoratorHost: envVar({
    name: "INTERNARBEIDSFLATEDECORATOR_HOST",
  }),

  fastlegerest: {
    applicationName: "fastlegerest",
    clientId: envVar({
      name: "FASTLEGEREST_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "FASTLEGEREST_HOST",
    }),
  },
  isaktivitetskrav: {
    applicationName: "isaktivitetskrav",
    clientId: envVar({
      name: "ISAKTIVITETSKRAV_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISAKTIVITETSKRAV_HOST",
    }),
    removePathPrefix: true,
  },
  isbehandlerdialog: {
    applicationName: "isbehandlerdialog",
    clientId: envVar({
      name: "ISBEHANDLERDIALOG_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISBEHANDLERDIALOG_HOST",
    }),
    removePathPrefix: true,
  },
  isdialogmelding: {
    applicationName: "isdialogmelding",
    clientId: envVar({
      name: "ISDIALOGMELDING_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISDIALOGMELDING_HOST",
    }),
    removePathPrefix: true,
  },
  isdialogmote: {
    applicationName: "isdialogmote",
    clientId: envVar({
      name: "ISDIALOGMOTE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISDIALOGMOTE_HOST",
    }),
    removePathPrefix: true,
  },
  isdialogmotekandidat: {
    applicationName: "isdialogmotekandidat",
    clientId: envVar({
      name: "ISDIALOGMOTEKANDIDAT_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISDIALOGMOTEKANDIDAT_HOST",
    }),
    removePathPrefix: true,
  },
  ishuskelapp: {
    applicationName: "ishuskelapp",
    clientId: envVar({
      name: "ISHUSKELAPP_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISHUSKELAPP_HOST",
    }),
    removePathPrefix: true,
  },
  isnarmesteleder: {
    applicationName: "isnarmesteleder",
    clientId: envVar({
      name: "ISNARMESTELEDER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISNARMESTELEDER_HOST",
    }),
    removePathPrefix: true,
  },
  isoppfolgingstilfelle: {
    applicationName: "isoppfolgingstilfelle",
    clientId: envVar({
      name: "ISOPPFOLGINGSTILFELLE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISOPPFOLGINGSTILFELLE_HOST",
    }),
    removePathPrefix: true,
  },
  ispengestopp: {
    applicationName: "ispengestopp",
    clientId: envVar({
      name: "ISPENGESTOPP_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISPENGESTOPP_HOST",
    }),
    removePathPrefix: true,
  },
  ispersonoppgave: {
    applicationName: "ispersonoppgave",
    clientId: envVar({
      name: "ISPERSONOPPGAVE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISPERSONOPPGAVE_HOST",
    }),
    removePathPrefix: true,
  },
  modiacontextholder: {
    applicationName: "modiacontextholder",
    clientId: envVar({
      name: "MODIACONTEXTHOLDER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "MODIACONTEXTHOLDER_HOST",
    }),
  },
  syfobehandlendeenhet: {
    applicationName: "syfobehandlendeenhet",
    clientId: envVar({
      name: "SYFOBEHANDLENDEENHET_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOBEHANDLENDEENHET_HOST",
    }),
    removePathPrefix: true,
  },
  ereg: {
    applicationName: "ereg",
    clientId: "",
    host: envVar({
      name: "EREG_HOST",
    }),
  },
  syfomotebehov: {
    applicationName: "syfomotebehov",
    clientId: envVar({
      name: "SYFOMOTEBEHOV_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOMOTEBEHOV_HOST",
    }),
  },
  syfooppfolgingsplanservice: {
    applicationName: "syfooppfolgingsplanservice",
    clientId: envVar({
      name: "SYFOOPPFOLGINGSPLANSERVICE_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOOPPFOLGINGSPLANSERVICE_HOST",
    }),
  },
  syfoperson: {
    applicationName: "syfoperson",
    clientId: envVar({
      name: "SYFOPERSON_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOPERSON_HOST",
    }),
  },
  syfosmregister: {
    applicationName: "syfosmregister",
    clientId: envVar({
      name: "SYFOSMREGISTER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOSMREGISTER_HOST",
    }),
    removePathPrefix: true,
  },
  sykepengesoknadBackend: {
    applicationName: "sykepengesoknad-backend",
    clientId: envVar({
      name: "SYKEPENGESOKNAD_BACKEND_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYKEPENGESOKNAD_BACKEND_HOST",
    }),
    removePathPrefix: true,
  },
  istilgangskontroll: {
    applicationName: "istilgangskontroll",
    clientId: envVar({
      name: "ISTILGANGSKONTROLL_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ISTILGANGSKONTROLL_HOST",
    }),
    removePathPrefix: true,
  },
  syfoveileder: {
    applicationName: "syfoveileder",
    clientId: envVar({
      name: "SYFOVEILEDER_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "SYFOVEILEDER_HOST",
    }),
  },
  esyfovarsel: {
    applicationName: "esyfovarsel",
    clientId: envVar({
      name: "ESYFOVARSEL_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "ESYFOVARSEL_HOST",
    }),
    removePathPrefix: true,
  },
  flexjar: {
    applicationName: "flexjar-backend",
    clientId: envVar({
      name: "FLEXJAR_AAD_APP_CLIENT_ID",
    }),
    host: envVar({
      name: "FLEXJAR_HOST",
    }),
  },
};

export const redis = {
  host: envVar({ name: "REDIS_HOST", defaultValue: "" }),
  port: Number.parseInt(envVar({ name: "REDIS_PORT", defaultValue: "6379" })),
  password: envVar({
    name: "REDIS_PASSWORD",
    defaultValue: { dev: "", prod: "" },
  }),
};

export const unleash: { serverApiUrl: string; serverApiToken: string } = {
  serverApiUrl: envVar({ name: "UNLEASH_SERVER_API_URL" }),
  serverApiToken: envVar({ name: "UNLEASH_SERVER_API_TOKEN" }),
};

module.exports = {
  auth: auth,
  isDev: isDev,
  isProd: isProd,
  redis: redis,
  unleash: unleash,
  server: server,
};
