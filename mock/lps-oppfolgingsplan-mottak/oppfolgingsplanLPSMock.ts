import dayjs from "dayjs";
import {
  ARBEIDSTAKER_DEFAULT,
  VIRKSOMHET_PONTYPANDY,
} from "../common/mockConstants";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";

const getDefaultOppfolgingsplanLPS = (created: Date): OppfolgingsplanLPS => {
  return {
    uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd2",
    fnr: ARBEIDSTAKER_DEFAULT.personIdent,
    virksomhetsnummer: VIRKSOMHET_PONTYPANDY.virksomhetsnummer,
    opprettet: dayjs(created).subtract(1, "days").toJSON(),
    sistEndret: dayjs(created).subtract(1, "days").toJSON(),
  };
};

export const oppfolgingsplanerLPSMock = (
  created: Date
): OppfolgingsplanLPS[] => {
  return [
    getDefaultOppfolgingsplanLPS(created),
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd3",
      opprettet: dayjs(created).subtract(10, "days").toJSON(),
      sistEndret: dayjs(created).subtract(10, "days").toJSON(),
    },
    {
      ...getDefaultOppfolgingsplanLPS(created),
      uuid: "5f1e2629-062b-442d-ae1f-3b08e9574cd4",
      opprettet: created.toJSON(),
      sistEndret: created.toJSON(),
    },
  ];
};
