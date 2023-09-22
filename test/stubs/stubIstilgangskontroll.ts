import nock from "nock";
import { ISTILGANGSKONTROLL_ROOT } from "@/apiConstants";
import { tilgangBrukerMock } from "../../mock/istilgangskontroll/tilgangtilbrukerMock";

export const stubTilgangApi = (
  scope: nock.Scope,
  tilgangMock = tilgangBrukerMock
) => {
  return scope
    .get(`${ISTILGANGSKONTROLL_ROOT}/tilgang/navident/person`)
    .reply(200, () => tilgangMock);
};
