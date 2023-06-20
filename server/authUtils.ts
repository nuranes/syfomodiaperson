import { Request } from "express";
import OpenIdClient = require("openid-client");
import Url = require("url");
import {
  createRemoteJWKSet,
  FlattenedJWSInput,
  JWSHeaderParameters,
  jwtVerify,
} from "jose";
import { GetKeyFunction, JWTPayload } from "jose/dist/types/types";

import Config = require("./config");

type OboToken = {
  accessToken: string;
  expiresIn: number;
};

type CachedOboToken = {
  token: OboToken;
  expires: number;
};

declare module "express-session" {
  export interface SessionData {
    tokenCache: { [clientId: string]: CachedOboToken };
  }
}

const OBO_TOKEN_EXPIRATION_MARGIN_SECONDS = 60;

let _remoteJWKSet: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

async function initJWKSet() {
  _remoteJWKSet = await createRemoteJWKSet(new URL(Config.auth.jwksUri));
}

const retrieveAndValidateToken = async (
  req: Request,
  azureAdIssuer: OpenIdClient.Issuer<any>
): Promise<string | undefined> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token && (await validateToken(token, azureAdIssuer))) {
    return token;
  }
  return undefined;
};

const validateToken = async (
  token: string,
  azureAdIssuer: OpenIdClient.Issuer<any>
) => {
  try {
    if (!_remoteJWKSet) {
      await initJWKSet();
    }
    const verification = await jwtVerify(token, _remoteJWKSet, {
      audience: Config.auth.clientId,
      issuer: azureAdIssuer.metadata.issuer,
    });
    return checkVerificationPayload(verification.payload);
  } catch (e) {
    console.error("Token validation failed:", e);
  }
  return false;
};

const checkVerificationPayload = (payload: JWTPayload) => {
  if (
    payload &&
    payload.aud == Config.auth.clientId &&
    payload.exp &&
    payload.exp * 1000 > Date.now()
  ) {
    return true;
  } else {
    console.error(
      "Token audience or expiry check failed: aud " +
        payload.aud +
        " exp " +
        payload.exp
    );
  }
  return false;
};

const isNotExpired = (token: CachedOboToken) => {
  return (
    token.expires >= Date.now() + OBO_TOKEN_EXPIRATION_MARGIN_SECONDS * 1000
  );
};

export const getOrRefreshOnBehalfOfToken = async (
  authClient: OpenIdClient.Client,
  issuer: OpenIdClient.Issuer<any>,
  req: Request,
  clientId: string
): Promise<OboToken | undefined> => {
  const token = await retrieveAndValidateToken(req, issuer);
  if (!token) {
    throw Error(
      "Could not get on-behalf-of token because the token was undefined"
    );
  }
  if (req.session.tokenCache === undefined) {
    req.session.tokenCache = {};
  }

  let cachedOboToken = req.session.tokenCache[clientId];
  if (cachedOboToken && isNotExpired(cachedOboToken)) {
    return cachedOboToken.token;
  } else {
    const onBehalfOfToken = await requestOnBehalfOfToken(
      authClient,
      token,
      clientId
    );
    if (!onBehalfOfToken) {
      return undefined;
    }
    cachedOboToken = {
      token: onBehalfOfToken,
      expires: Date.now() + onBehalfOfToken.expiresIn * 1000,
    };
    req.session.tokenCache[clientId] = cachedOboToken;
  }
  return cachedOboToken.token;
};

const requestOnBehalfOfToken = async (
  authClient: OpenIdClient.Client,
  accessToken: string,
  clientId: string
): Promise<OboToken | undefined> => {
  const grantBody = {
    assertion: accessToken,
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    scope: `api://${clientId}/.default`,
  };
  const tokenSet = await authClient.grant(grantBody);
  if (!tokenSet) {
    return undefined;
  } else {
    return {
      accessToken: tokenSet.access_token,
      expiresIn: tokenSet.expires_in,
    } as OboToken;
  }
};

export const getOpenIdIssuer = async (): Promise<OpenIdClient.Issuer<any>> => {
  try {
    return OpenIdClient.Issuer.discover(Config.auth.discoverUrl);
  } catch (e) {
    console.log("Could not discover issuer", Config.auth.discoverUrl);
    throw e;
  }
};

export const getOpenIdClient = async (
  issuer: OpenIdClient.Issuer<any>
): Promise<OpenIdClient.Client> => {
  return new issuer.Client(
    {
      client_id: Config.auth.clientId,
      redirect_uris: [Config.auth.redirectUri],
      token_endpoint_auth_method: "private_key_jwt",
      token_endpoint_auth_signing_alg: "RS256",
    },
    Config.auth.jwks
  );
};
