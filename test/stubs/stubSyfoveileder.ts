import { veilederMock } from "../../mock/syfoveileder/veilederMock";
import nock from "nock";
import { SYFOVEILEDER_ROOT } from "@/apiConstants";

export const stubAktivVeilederinfoApi = (scope: nock.Scope) =>
  scope
    .get(`${SYFOVEILEDER_ROOT}/veileder/self`)
    .reply(200, () => veilederMock);

export const stubVeilederinfoApi = (scope: nock.Scope) =>
  scope
    .get(`${SYFOVEILEDER_ROOT}/veileder/${veilederMock.ident}`)
    .reply(200, () => veilederMock);
