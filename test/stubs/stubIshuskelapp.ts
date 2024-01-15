import nock from "nock";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { OppfolgingsoppgaveResponseDTO } from "@/data/oppfolgingsoppgave/types";

export const stubOppfolgingsoppgaveApi = (
  scope: nock.Scope,
  oppfolgingsoppgave: OppfolgingsoppgaveResponseDTO | undefined
) => {
  scope
    .get(`${ISHUSKELAPP_ROOT}/huskelapp`)
    .reply(200, () => oppfolgingsoppgave);
};
