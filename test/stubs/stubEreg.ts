import nock from "nock";
import { virksomhetMock } from "../../mock/ereg/virksomhetMock";
import { EREG_ROOT } from "@/apiConstants";

export const stubVirksomhetApi = (scope: nock.Scope, orgnummer: string) =>
  scope
    .get(`${EREG_ROOT}/organisasjon/${orgnummer}`)
    .reply(200, () => virksomhetMock());
