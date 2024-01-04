import nock from "nock";
import { FLEXJAR_ROOT } from "@/apiConstants";

export const stubFlexjarApiOk = (scope: nock.Scope) => {
  return scope.post(new RegExp(`${FLEXJAR_ROOT}/feedback/azure`)).reply(200);
};

export const stubFlexjarApiError = (scope: nock.Scope) => {
  return scope.post(new RegExp(`${FLEXJAR_ROOT}/feedback/azure`)).reply(500);
};
