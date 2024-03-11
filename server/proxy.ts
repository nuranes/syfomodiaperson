import express = require("express");
import proxy = require("express-http-proxy");
import OpenIdClient = require("openid-client");
import url = require("url");

import AuthUtils = require("./authUtils");
import Config = require("./config");

const proxyExternalHostWithoutAuthentication = (host: any) =>
  proxy(host, {
    https: false,
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(host);
      const pathFromApi =
        urlFromApi.pathname === "/" ? "" : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi ? pathFromApi : "") +
        (pathFromRequest ? pathFromRequest : "") +
        (queryString ? "?" + queryString : "");

      return newPath;
    },
    proxyErrorHandler: (err, res, next) => {
      console.log(`Error in proxy for ${host} ${err.message}, ${err.code}`);
      if (err && err.code === "ECONNREFUSED") {
        console.log("proxyErrorHandler: Got ECONNREFUSED");
        return res.status(503).send({ message: `Could not contact ${host}` });
      }
      next(err);
    },
  });

const proxyDirectly = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  authClient: any,
  externalAppConfig: Config.ExternalAppConfig
) => {
  return proxyExternalHostWithoutAuthentication(externalAppConfig.host)(
    req,
    res,
    next
  );
};

const proxyExternalHost = (
  { applicationName, host, removePathPrefix }: any,
  accessToken: any,
  parseReqBody: any
) =>
  proxy(host, {
    https: false,
    parseReqBody: parseReqBody,
    proxyReqOptDecorator: async (options, srcReq) => {
      if (!accessToken) {
        return options;
      }
      if (!options.headers) {
        options.headers = {};
      }
      options.headers["Authorization"] = `Bearer ${accessToken}`;
      if (host === Config.auth.syfosmregister.host) {
        options.headers["fnr"] = options.headers["nav-personident"]; // TODO: brukes dette?
      }
      return options;
    },
    proxyReqPathResolver: (req) => {
      const urlFromApi = url.parse(host);
      const pathFromApi =
        urlFromApi.pathname === "/" ? "" : urlFromApi.pathname;

      const urlFromRequest = url.parse(req.originalUrl);
      const pathFromRequest = urlFromRequest.pathname;

      const queryString = urlFromRequest.query;
      const newPath =
        (pathFromApi ? pathFromApi : "") +
        (pathFromRequest ? pathFromRequest : "") +
        (queryString ? "?" + queryString : "");

      if (removePathPrefix) {
        const newPathWithoutPrefix = newPath.replace(`${applicationName}/`, "");
        return newPathWithoutPrefix;
      }
      return newPath;
    },
    proxyErrorHandler: (err, res, next) => {
      console.log(`Error in proxy for ${host} ${err.message}, ${err.code}`);
      if (err && err.code === "ECONNREFUSED") {
        console.log("proxyErrorHandler: Got ECONNREFUSED");
        return res.status(503).send({ message: `Could not contact ${host}` });
      }
      next(err);
    },
  });

const proxyOnBehalfOf = (
  req: any,
  res: any,
  next: any,
  authClient: any,
  issuer: OpenIdClient.Issuer<any>,
  externalAppConfig: Config.ExternalAppConfig
) => {
  AuthUtils.getOrRefreshOnBehalfOfToken(
    authClient,
    issuer,
    req,
    externalAppConfig.clientId
  )
    .then((onBehalfOfToken: any) => {
      if (!onBehalfOfToken.accessToken) {
        res.status(500).send("Failed to fetch access token on behalf of user.");
        console.log(
          "proxyOnBehalfOf: Got on-behalf-of token, but the accessToken was undefined"
        );
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        onBehalfOfToken.accessToken,
        req.method === "POST"
      )(req, res, next);
    })
    .catch((error) => {
      console.log("Failed to renew token(s). Original error: %s", error);
      res
        .status(500)
        .send("Failed to fetch/refresh access tokens on behalf of user");
    });
};

export const setupProxy = (
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<any>
) => {
  const router = express.Router();

  router.use(
    "/isaktivitetskrav/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isaktivitetskrav
      );
    }
  );

  router.use(
    "/isarbeidsuforhet/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isarbeidsuforhet
      );
    }
  );

  router.use(
    "/isbehandlerdialog/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isbehandlerdialog
      );
    }
  );

  router.use(
    "/isdialogmote/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isdialogmote
      );
    }
  );

  router.use(
    "/isdialogmotekandidat/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isdialogmotekandidat
      );
    }
  );

  router.use(
    "/isdialogmelding/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isdialogmelding
      );
    }
  );

  router.use(
    "/ishuskelapp/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ishuskelapp
      );
    }
  );

  router.use(
    "/isnarmesteleder/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isnarmesteleder
      );
    }
  );

  router.use(
    "/isoppfolgingstilfelle/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.isoppfolgingstilfelle
      );
    }
  );

  router.use(
    "/ispengestopp/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ispengestopp
      );
    }
  );

  router.use(
    "/ispersonoppgave/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.ispersonoppgave
      );
    }
  );

  router.use(
    "/fastlegerest/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.fastlegerest
      );
    }
  );

  router.use(
    "/modiacontextholder/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.modiacontextholder
      );
    }
  );

  router.use(
    "/syfobehandlendeenhet/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfobehandlendeenhet
      );
    }
  );

  router.use(
    "/ereg/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyDirectly(req, res, next, authClient, Config.auth.ereg);
    }
  );

  router.use(
    "/syfomotebehov/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfomotebehov
      );
    }
  );

  router.use(
    "/syfooppfolgingsplanservice/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfooppfolgingsplanservice
      );
    }
  );

  router.use(
    "/lps-oppfolgingsplan-mottak/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.lpsOppfolgingsplanMottak
      );
    }
  );

  router.use(
    "/syfoperson/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoperson
      );
    }
  );

  router.use(
    "/syfosmregister/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfosmregister
      );
    }
  );

  router.use(
    "/sykepengesoknad-backend/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.sykepengesoknadBackend
      );
    }
  );

  router.use(
    "/istilgangskontroll/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.istilgangskontroll
      );
    }
  );

  router.use(
    "/syfoveileder/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.syfoveileder
      );
    }
  );

  router.use(
    "/esyfovarsel/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(
        req,
        res,
        next,
        authClient,
        issuer,
        Config.auth.esyfovarsel
      );
    }
  );

  router.use(
    "/flexjar-backend/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, issuer, Config.auth.flexjar);
    }
  );

  router.use(
    "/internarbeidsflatedecorator",
    proxy(Config.auth.internarbeidsflatedecoratorHost, {
      https: true,
      proxyReqPathResolver: (req: express.Request) => {
        return `/internarbeidsflatedecorator${req.url}`;
      },
      proxyErrorHandler: (
        err: any,
        res: express.Response,
        next: express.NextFunction
      ) => {
        console.log(
          `Error in proxy for internarbeidsflatedecorator ${err.message}, ${err.code}`
        );
        if (err && err.code === "ECONNREFUSED") {
          console.log("proxyErrorHandler: Got ECONNREFUSED");
          return res
            .status(503)
            .send({ message: `Could not contact internarbeidsflatedecorator` });
        }
        next(err);
      },
    })
  );

  return router;
};

module.exports = {
  setupProxy: setupProxy,
};
