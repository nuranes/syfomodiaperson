import nock from "nock";
import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import dayjs from "dayjs";
import { ARBEIDSTAKER_DEFAULT } from "../../mock/common/mockConstants";

export const stubMaxdateApi = (scope: nock.Scope, maxDate: Date) => {
  const maksdatoMock = {
    maxDate: {
      id: "123",
      fnr: ARBEIDSTAKER_DEFAULT.personIdent,
      forelopig_beregnet_slutt: dayjs(maxDate).format("YYYY-MM-DD"),
      utbetalt_tom: dayjs(maxDate).add(1, "month").format("YYYY-MM-DD"),
      gjenstaende_sykedager: "10",
      opprettet: dayjs(maxDate).subtract(1, "month"),
    },
  };

  return scope
    .get(`${ESYFOVARSEL_ROOT}/sykepenger/maxdate`)
    .reply(200, () => maksdatoMock);
};
