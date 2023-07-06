import nock from "nock";
import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import { maksdatoMock } from "../../mock/syfoperson/persondataMock";

export const stubMaxdateApi = (scope: nock.Scope, maxDate: string) => {
  const maksdato = {
    maxDate: {
      ...maksdatoMock.maxDate,
      forelopig_beregnet_slutt: maxDate,
    },
  };
  return scope
    .get(`${ESYFOVARSEL_ROOT}/sykepenger/maxdate`)
    .reply(200, () => maksdato);
};
