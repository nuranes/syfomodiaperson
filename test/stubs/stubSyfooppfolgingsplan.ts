import nock from "nock";
import {
  LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { oppfolgingsplanMock } from "../../mock/syfooppfolgingsplanservice/oppfolgingsplanMock";
import { oppfolgingsplanerLPSMock } from "../../mock/syfooppfolgingsplanservice/oppfolgingsplanLPSMock";
import { dokumentinfoMock } from "../../mock/syfooppfolgingsplanservice/dokumentinfoMock";
import { historikkoppfolgingsplanMock } from "../../mock/syfooppfolgingsplanservice/historikkoppfolgingsplanMock";

export const stubOppfolgingsplanApi = (scope: nock.Scope) => {
  return scope
    .get(`${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan`)
    .reply(200, () => oppfolgingsplanMock);
};

export const stubOppfolgingsplanLPSApi = (scope: nock.Scope, created: Date) => {
  return scope
    .get(`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps`)
    .reply(200, () => oppfolgingsplanerLPSMock(created));
};

export const stubDokumentinfoApi = (
  scope: nock.Scope,
  oppfolgingsplanId: number
) => {
  return scope
    .get(
      `${SYFOOPPFOLGINGSPLANSERVICE_V2_ROOT}/dokument/${oppfolgingsplanId}/dokumentinfo`
    )
    .reply(200, () => dokumentinfoMock);
};

export const stubOppfolgingsplanHistorikkApi = (scope: nock.Scope) => {
  scope
    .get(`${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/historikk`)
    .reply(200, () => historikkoppfolgingsplanMock);
};
