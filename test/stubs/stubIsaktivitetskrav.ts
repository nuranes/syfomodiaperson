import nock from "nock";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { aktivitetskravMock } from "../../mock/isaktivitetskrav/aktivitetskravMock";

export const stubAktivitetskravApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`)
    .reply(200, () => aktivitetskravMock);
};
