import nock from "nock";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { personoppgaverMock } from "../../mock/ispersonoppgave/personoppgaveMock";

export const stubPersonoppgaveApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISPERSONOPPGAVE_ROOT}/personoppgave/personident`)
    .reply(200, () => personoppgaverMock());
};
