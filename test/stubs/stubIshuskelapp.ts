import nock from "nock";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { HuskelappResponseDTO } from "@/data/huskelapp/huskelappTypes";

export const stubHuskelappApi = (
  scope: nock.Scope,
  huskelapp: HuskelappResponseDTO | undefined
) => {
  scope.get(`${ISHUSKELAPP_ROOT}/huskelapp`).reply(200, () => huskelapp);
};
