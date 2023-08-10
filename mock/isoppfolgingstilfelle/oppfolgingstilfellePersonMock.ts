import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "../common/mockConstants";

export const oppfolgingstilfellePersonMock = {
  oppfolgingstilfelleList: [
    {
      arbeidstakerAtTilfelleEnd: false,
      start: "2019-06-06",
      end: "2020-01-21",
      virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    },
    {
      arbeidstakerAtTilfelleEnd: true,
      start: "2020-02-21",
      end: "2020-12-10",
      virksomhetsnummerList: [VIRKSOMHET_PONTYPANDY.virksomhetsnummer],
    },
    {
      arbeidstakerAtTilfelleEnd: true,
      start: "2020-02-21",
      end: "2030-12-10",
      virksomhetsnummerList: [
        VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
        VIRKSOMHET_BRANNOGBIL.virksomhetsnummer,
        VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer,
      ],
    },
  ],
  personIdent: ARBEIDSTAKER_DEFAULT.personIdent,
};
