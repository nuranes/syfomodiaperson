import HttpsProxyAgent = require("https-proxy-agent");
import OpenIdClient = require("openid-client");

import Config = require("../config");

const OBO_TOKEN_EXPIRATION_MARGIN_SECONDS = 60;

const expired = (oboToken: any) => {
  return oboToken.expires_in <= OBO_TOKEN_EXPIRATION_MARGIN_SECONDS;
};

const getTokenSetById = (tokenSets: any, id: any) => {
  if (!(id in tokenSets)) {
    // Should have been initialized by passport
    return null;
  }
  if (tokenSets[id] instanceof OpenIdClient.TokenSet) {
    return tokenSets[id];
  }
  return new OpenIdClient.TokenSet(tokenSets[id]);
};

export const getOrRefreshOnBehalfOfToken = async (
  authClient: any,
  tokenSets: any,
  tokenSetId: any,
  clientId: any
) => {
  const selfToken = getTokenSetById(tokenSets, "self");
  if (!selfToken) {
    throw Error(
      "getOrRefreshOnBehalfOfToken: Missing self-token in tokenSets. This should have been set by the middleware."
    );
  }
  const onBehalfOfToken = getTokenSetById(tokenSets, clientId);
  if (!onBehalfOfToken) {
    const token = await getOrRefreshSelfTokenIfExpired(
      authClient,
      selfToken,
      tokenSets
    );
    const newOnBehalfOftoken = await requestOnBehalfOfToken(
      authClient,
      token,
      tokenSetId,
      clientId
    );
    tokenSets[clientId] = newOnBehalfOftoken;
    return newOnBehalfOftoken;
  }
  if (expired(onBehalfOfToken)) {
    const token = await getOrRefreshSelfTokenIfExpired(
      authClient,
      selfToken,
      tokenSets
    );
    const refreshedOnBehalfOfToken = await requestOnBehalfOfToken(
      authClient,
      token,
      tokenSetId,
      clientId
    );
    tokenSets[clientId] = refreshedOnBehalfOfToken;
    return refreshedOnBehalfOfToken;
  }
  return tokenSets[clientId];
};

const getOrRefreshSelfTokenIfExpired = async (
  authClient: any,
  selfToken: any,
  tokenSets: any
) => {
  if (selfToken.expired()) {
    const refreshedSelfToken = await authClient.refresh(selfToken);
    tokenSets[Config.tokenSetIdType.self] = refreshedSelfToken;
    return refreshedSelfToken;
  }
  return selfToken;
};

const getScope = (tokenSetId: any, clientId: any) => {
  if (tokenSetId === Config.tokenSetIdType.graph) {
    return `${clientId}/.default`;
  }
  return `api://${clientId}/.default`;
};

const requestOnBehalfOfToken = async (
  authClient: any,
  tokenSet: any,
  tokenSetId: any,
  clientId: any
) => {
  if (!tokenSet.access_token) {
    throw Error(
      "Could not get on-behalf-of token because the access_token was undefined"
    );
  }
  const grantBody = {
    assertion: tokenSet.access_token,
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    requested_token_use: "on_behalf_of",
    scope: getScope(tokenSetId, clientId),
  };
  return await authClient.grant(grantBody);
};

export const getOpenIdClient = async (issuerUrl: string) => {
  try {
    if (Config.server.proxy) {
      const proxyAgent = HttpsProxyAgent(Config.server.proxy);
      OpenIdClient.custom.setHttpOptionsDefaults({
        agent: {
          http: proxyAgent,
          https: proxyAgent,
        },
      });
    }
    const issuer = await OpenIdClient.Issuer.discover(issuerUrl);

    return new issuer.Client(
      {
        client_id: Config.auth.clientId,
        redirect_uris: [Config.auth.redirectUri],
        token_endpoint_auth_method: "private_key_jwt",
        token_endpoint_auth_signing_alg: "RS256",
      },
      Config.auth.jwks
    );
  } catch (e) {
    console.log("Could not discover issuer", issuerUrl);
    throw e;
  }
};

module.exports = {
  getOpenIdClient: getOpenIdClient,
  getOrRefreshOnBehalfOfToken: getOrRefreshOnBehalfOfToken,
};
