import nock from "nock";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";

export const stubAktivitetskravApi = (scope: nock.Scope) => {
  return scope
    .get(`${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurdering`)
    .reply(200, () => undefined);
};

export const stubArbeidsuforhetForhandsvarselApi = (scope: nock.Scope) => {
  return scope
    .post(new RegExp(`${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/forhandsvarsel`))
    .reply(201);
};
