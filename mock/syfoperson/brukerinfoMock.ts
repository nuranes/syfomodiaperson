import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../common/mockConstants";

export const brukerinfoMock = {
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  kontaktinfo: {
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    epost: ARBEIDSTAKER_DEFAULT.epost,
    tlf: "99887766",
    skalHaVarsel: true,
  },
  arbeidssituasjon: "ARBEIDSTAKER",
};
