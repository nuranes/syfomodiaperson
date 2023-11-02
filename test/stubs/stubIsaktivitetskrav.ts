import nock from "nock";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { aktivitetskravMock } from "../../mock/isaktivitetskrav/aktivitetskravMock";

export const stubAktivitetskravApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`)
    .reply(200, () => aktivitetskravMock);
};

export const stubVurderAktivitetskravApi = (scope: nock.Scope) => {
  return scope
    .post(new RegExp(`${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/.*/vurder`))
    .reply(200);
};

export const stubVurderAktivitetskravForhandsvarselApi = (
  scope: nock.Scope
) => {
  return scope
    .post(
      new RegExp(`${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/.*/forhandsvarsel`)
    )
    .reply(200);
};
