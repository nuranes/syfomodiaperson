import {
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_ENTERPRISE,
  VIRKSOMHET_KONKURS,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "../common/mockConstants";
import { EregOrganisasjonResponseDTO } from "../../src/data/virksomhet/types/EregOrganisasjonResponseDTO";

export const eregOrganisasjonResponse = (
  virksomhetsnavn: string
): EregOrganisasjonResponseDTO => {
  return {
    navn: {
      navnelinje1: virksomhetsnavn,
      redigertnavn: `${virksomhetsnavn}, Oslo`,
    },
  };
};

export const virksomhetMock = (virksomhetsnummer?: string) => {
  switch (virksomhetsnummer) {
    case VIRKSOMHET_PONTYPANDY.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_PONTYPANDY.virksomhetsnavn);
    case VIRKSOMHET_BRANNOGBIL.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_BRANNOGBIL.virksomhetsnavn);
    case VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnummer:
      return eregOrganisasjonResponse(
        VIRKSOMHET_UTEN_NARMESTE_LEDER.virksomhetsnavn
      );
    case VIRKSOMHET_ENTERPRISE.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_ENTERPRISE.virksomhetsnavn);
    case VIRKSOMHET_KONKURS.virksomhetsnummer:
      return eregOrganisasjonResponse(VIRKSOMHET_KONKURS.virksomhetsnavn);
    default:
      return null;
  }
};
