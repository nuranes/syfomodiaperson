import {
  VIRKSOMHET_BRANNOGBIL,
  VIRKSOMHET_PONTYPANDY,
  VIRKSOMHET_UTEN_NARMESTE_LEDER,
} from "../common/mockConstants";

export const eregOrganisasjonResponse = (virksomhetsnavn: string) => {
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
    default:
      return null;
  }
};
