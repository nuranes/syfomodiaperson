export interface EregOrganisasjonResponseDTO {
  navn: EregOrganisasjonNavnDTO;
}

interface EregOrganisasjonNavnDTO {
  navnelinje1: string;
  redigertnavn?: string;
}

export const getVirksomhetsnavn = (
  eregOrganisasjonResponseDTO: EregOrganisasjonResponseDTO
): string => {
  const redigertnavn = eregOrganisasjonResponseDTO.navn.redigertnavn;
  if (redigertnavn && redigertnavn.length > 0) {
    return redigertnavn;
  } else {
    return eregOrganisasjonResponseDTO.navn.navnelinje1;
  }
};
