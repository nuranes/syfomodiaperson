import nock from "nock";
import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import dayjs from "dayjs";

export const stubMaxdateApi = (scope: nock.Scope, maxDate: Date) => {
  const maksdatoMock = {
    maxDate: dayjs(maxDate).format("YYYY-MM-DD"),
  };

  return scope
    .get(`${ESYFOVARSEL_ROOT}/sykepenger/maxdate`)
    .reply(200, () => maksdatoMock);
};
