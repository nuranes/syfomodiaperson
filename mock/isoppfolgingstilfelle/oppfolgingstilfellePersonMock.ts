import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "../common/mockConstants";
import { OppfolgingstilfellePersonDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

export const oppfolgingstilfellePersonMock: OppfolgingstilfellePersonDTO = {
  oppfolgingstilfelleList: [
    {
      arbeidstakerAtTilfelleEnd: false,
      start: new Date("2019-06-06"),
      end: new Date("2020-01-21"),
      virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
      antallSykedager: 230,
      varighetUker: 25,
    },
    {
      arbeidstakerAtTilfelleEnd: true,
      start: new Date("2020-02-21"),
      end: new Date("2020-12-10"),
      virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
      antallSykedager: 294,
      varighetUker: 48,
    },
    {
      arbeidstakerAtTilfelleEnd: true,
      start: new Date("2020-02-21"),
      end: new Date("2030-12-10"),
      virksomhetsnummerList: [
        VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
        VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer,
      ],
      antallSykedager: 3946,
      varighetUker: 48,
    },
  ],
  personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
};
