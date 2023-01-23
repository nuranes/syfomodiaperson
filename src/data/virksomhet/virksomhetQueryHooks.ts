import { EREG_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  EregOrganisasjonResponseDTO,
  getVirksomhetsnavn,
} from "@/data/virksomhet/types/EregOrganisasjonResponseDTO";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

const virksomhetQueryKeys = {
  virksomhet: (virksomhetsnummer: string) => ["virksomhet", virksomhetsnummer],
};

export const useVirksomhetQuery = (virksomhetsnummer: string) => {
  const path = `${EREG_ROOT}/organisasjon/${virksomhetsnummer}`;
  const fetchVirksomhet = () => get<EregOrganisasjonResponseDTO>(path);
  const query = useQuery(
    virksomhetQueryKeys.virksomhet(virksomhetsnummer),
    fetchVirksomhet,
    {
      enabled: !!virksomhetsnummer,
      staleTime: minutesToMillis(60 * 12),
    }
  );

  return {
    ...query,
    virksomhetsnavn: query.data && getVirksomhetsnavn(query.data),
  };
};
