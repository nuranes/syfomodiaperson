import { ENHET_GRUNERLOKKA, ENHET_NAV_UTLAND } from "../common/mockConstants";
import { PersonDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { DEFAULT_GODKJENT_FNR } from "../util/requestUtil";

export const behandlendeEnhetMock = {
  enhetId: ENHET_GRUNERLOKKA.nummer,
  navn: ENHET_GRUNERLOKKA.navn,
};

export const behandlendeEnhetNavUtlandMock = {
  enhetId: ENHET_NAV_UTLAND.nummer,
  navn: ENHET_NAV_UTLAND.navn,
};

export const personDTOMock: PersonDTO = {
  personident: DEFAULT_GODKJENT_FNR,
  isNavUtland: true,
};
