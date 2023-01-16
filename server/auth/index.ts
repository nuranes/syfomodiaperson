import express = require("express");
import OpenIdClient = require("openid-client");
import passport = require("passport");

import AuthUtils = require("./utils");
import Config = require("../config");
import Session = require("../session");

import dotenv = require("dotenv");
dotenv.config();

export const ensureAuthenticated = () => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send("Unauthorized");
  };
};

const getStrategy = async (authClient: any) => {
  return new OpenIdClient.Strategy(
    {
      client: authClient,
      params: {
        response_type: Config.auth.responseType,
        response_mode: Config.auth.responseMode,
        scope: `openid offline_access ${Config.auth.clientId}/.default`,
      },
      usePKCE: "S256",
      passReqToCallback: true,
    },
    (req: any, tokenSet: any, done: any) => {
      if (!tokenSet.expired()) {
        return done(null, {
          tokenSets: {
            [Config.tokenSetIdType.self]: tokenSet,
          },
        });
      }
      // Passport kaller bare denne funksjonen for å mappe en ny innlogging til et User-objekt, så man skal ikke havne her.
      console.log(
        "OpenIdClient.Strategy: Failed to map tokenSet to User because the tokenSet has already expired."
      );
      done(null, undefined);
    }
  );
};

const setupPassport = async (app: express.Application, authClient: any) => {
  app.use(passport.initialize());
  app.use(passport.session());

  const authName = Config.isDev ? "localAuth" : "aad";
  const authStrategy = await getStrategy(authClient);

  passport.use(authName, authStrategy);
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  app.get(
    "/login",
    (req: any, _res: express.Response, next: express.NextFunction) => {
      if (typeof req.query.redirectTo === "string") {
        req.session.redirectTo = req.query.redirectTo;
      }
      next();
    },
    passport.authenticate(authName, { failureRedirect: "/login-failed" })
  );
  app.get("/logout", (req: express.Request, res: express.Response) => {
    req.logout();
    res.redirect("/");
  });
  app.get(
    "/oauth2/callback",
    passport.authenticate(authName, { failureRedirect: "/login-failed" }),
    (req: any, res: express.Response) => {
      res.redirect(req.session.redirectTo || "/");
    }
  );
  app.get("/login-failed", (_req: express.Request, res: express.Response) => {
    res.send("login failed");
  });
};

export const setupAuth = async (app: express.Application) => {
  Session.setupSession(app);

  const authClient = await AuthUtils.getOpenIdClient(Config.auth.discoverUrl);

  await setupPassport(app, authClient);

  return authClient;
};

module.exports = {
  setupAuth: setupAuth,
  ensureAuthenticated: ensureAuthenticated,
};
