import nock from "nock";
import { SYKEPENGESOKNAD_BACKEND_ROOT } from "@/apiConstants";
import { soknaderMock } from "../../mock/sykepengesoknad/soknaderMock";

export const stubSykepengesoknadBackendApi = (scope: nock.Scope, fnr: string) =>
  scope
    .get(`${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader?fnr=${fnr}`)
    .reply(200, () => soknaderMock);
