import nock from "nock";
import { SYFOOVERSIKTSRV_PERSONTILDELING_ROOT } from "@/apiConstants";

export const stubSyfooversiktsrvPersontildelingNoContent = (
  scope: nock.Scope
) =>
  scope
    .get(`${SYFOOVERSIKTSRV_PERSONTILDELING_ROOT}/personer/single`)
    .reply(204);
