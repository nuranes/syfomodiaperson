import nock from "nock";
import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import {
  BehandlendeEnhet,
  PersonDTO,
} from "@/data/behandlendeenhet/types/BehandlendeEnhet";

export const stubBehandlendeEnhetApi = (
  scope: nock.Scope,
  enhet?: BehandlendeEnhet
) =>
  scope.get(`${SYFOBEHANDLENDEENHET_ROOT}/personident`).reply(200, () => enhet);

export const stubChangeEnhetApi = (scope: nock.Scope, person?: PersonDTO) =>
  scope.post(`${SYFOBEHANDLENDEENHET_ROOT}/person`).reply(200, () => person);
