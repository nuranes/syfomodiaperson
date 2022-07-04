import express = require("express");
import proxy = require("express-http-proxy");
import url = require("url");

import AuthUtils = require("./auth/utils");
import Config = require("./config");

const proxyExternalHostWithoutAuthentication = (host: any) =>
  proxy(host, {
    https: true,
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

      return `https://${newPath}`;
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
  const user = req.user as any;
  if (!user) {
    console.log("Missing user in route, waiting for middleware authentication");
    res
      .status(401)
      .header(
        "WWW-Authenticate",
        `OAuth realm=${externalAppConfig.host}, charset="UTF-8"`
      )
      .send("Not authenticated");
    return;
  }

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
    https: true,
    parseReqBody: parseReqBody,
    proxyReqOptDecorator: async (options, srcReq) => {
      if (!accessToken) {
        return options;
      }
      if (!options.headers) {
        options.headers = {};
      }
      if (host === Config.auth.modiacontextholder.host) {
        const reqUser = srcReq.user as any;
        if (!reqUser) {
          return options;
        }
        const selfAccessToken = reqUser.tokenSets.self.access_token;
        options.headers["Authorization"] = `Bearer ${selfAccessToken}`;
        options.headers["Cookie"] = `isso-accesstoken=${accessToken}`;
      } else {
        options.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      if (host === Config.auth.syfosmregister.host) {
        options.headers["fnr"] = options.headers["nav-personident"];
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
        return `https://${newPathWithoutPrefix}`;
      }
      return `https://${newPath}`;
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
  externalAppConfig: Config.ExternalAppConfig
) => {
  const user = req.user;
  if (!user) {
    console.log("Missing user in route, waiting for middleware authentication");
    res
      .status(401)
      .header(
        "WWW-Authenticate",
        `OAuth realm=${externalAppConfig.host}, charset="UTF-8"`
      )
      .send("Not authenticated");
    return;
  }

  AuthUtils.getOrRefreshOnBehalfOfToken(
    authClient,
    user.tokenSets,
    externalAppConfig.tokenSetId,
    externalAppConfig.clientId
  )
    .then((onBehalfOfToken: any) => {
      if (!onBehalfOfToken.access_token) {
        res.status(500).send("Failed to fetch access token on behalf of user.");
        console.log(
          "proxyReqOptDecorator: Got on-behalf-of token, but the access_token was undefined"
        );
        return;
      }
      return proxyExternalHost(
        externalAppConfig,
        onBehalfOfToken.access_token,
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

export const setupProxy = (authClient: any) => {
  const router = express.Router();

  router.use(
    "/isdialogmote/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.isdialogmote);
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
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.isdialogmelding);
    }
  );

  router.use(
    "/isnarmesteleder/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.isnarmesteleder);
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
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.ispengestopp);
    }
  );

  router.use(
    "/ispersonoppgave/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.ispersonoppgave);
    }
  );

  router.use(
    "/fastlegerest/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.fastlegerest);
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
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfomotebehov);
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
        Config.auth.syfooppfolgingsplanservice
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
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfoperson);
    }
  );

  router.use(
    "/syfosmregister/*",
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfosmregister);
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
        Config.auth.sykepengesoknadBackend
      );
    }
  );

  router.use(
    "/syfo-tilgangskontroll/*",
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
        Config.auth.syfotilgangskontroll
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
      proxyOnBehalfOf(req, res, next, authClient, Config.auth.syfoveileder);
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
