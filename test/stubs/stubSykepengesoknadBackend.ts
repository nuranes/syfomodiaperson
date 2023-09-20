import nock from "nock";
import { SYKEPENGESOKNAD_BACKEND_ROOT } from "@/apiConstants";
import { soknaderMock } from "../../mock/sykepengesoknad/soknaderMock";

export const stubSykepengesoknadBackendApi = (scope: nock.Scope) =>
  scope
    .get(`${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader`)
    .reply(200, () => soknaderMock);
