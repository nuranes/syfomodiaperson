import {
  ARBEIDSTAKER_DEFAULT,
  ARBEIDSTAKER_DEFAULT_FULL_NAME,
} from "../common/mockConstants";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { weeksFromToday } from "../../test/testUtils";

export const brukerinfoMock: BrukerinfoDTO = {
  navn: ARBEIDSTAKER_DEFAULT_FULL_NAME,
  kontaktinfo: {
    epost: ARBEIDSTAKER_DEFAULT.epost,
    tlf: "99887766",
    skalHaVarsel: true,
  },
  arbeidssituasjon: "ARBEIDSTAKER",
  dodsdato: null,
  tilrettelagtKommunikasjon: null,
  sikkerhetstiltak: [],
};

export const diskresjonskodeMock: "6" | "7" | "" = "";

export const isEgenansattMock = false;

export const maksdato = weeksFromToday(13).toString();

export const maksdatoMock = {
  maxDate: {
    id: "123",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    forelopig_beregnet_slutt: maksdato,
    utbetalt_tom: "2024-07-01",
    gjenstaende_sykedager: "70",
    opprettet: "2023-01-01T12:00:00.000000",
  },
};
