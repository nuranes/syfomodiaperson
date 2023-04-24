import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

export const behandlereQueryKeys = {
  behandlere: (fnr: string) => ["behandlere", fnr],
  behandlerRef: (behandlerRef: string) => ["behandlerRef", behandlerRef],
};

export const useBehandlereQuery = () => {
  const fnr = useValgtPersonident();
  const fetchBehandlere = () =>
    get<BehandlerDTO[]>(`${ISDIALOGMELDING_ROOT}/behandler/personident`, fnr);
  const query = useQuery({
    queryKey: behandlereQueryKeys.behandlere(fnr),
    queryFn: fetchBehandlere,
    enabled: !!fnr,
  });

  return {
    ...query,
    data: query.data || [],
  };
};

export const useSokBehandlereQuery = (searchstring: string) => {
  const fnr = useValgtPersonident();
  const searchHeader = { searchstring: searchstring }; // TODO: Vurder om vi bør prefix header med "nav-"
  const sokBehandlere = () =>
    get<BehandlerDTO[]>(
      `${ISDIALOGMELDING_ROOT}/behandler/search`,
      fnr,
      searchHeader
    );

  const query = useQuery({
    queryKey: ["search", searchstring],
    queryFn: sokBehandlere,
    enabled: !!searchstring,
  });

  return {
    ...query,
    data: query.data || [],
  };
};

export const useBehandlerByBehandlerRefQuery = (
  behandlerRef: string,
  isEnabled: boolean
) => {
  const fetchBehandlerByBehandlerRef = () =>
    get<BehandlerDTO>(`${ISDIALOGMELDING_ROOT}/behandler/${behandlerRef}`);

  return useQuery({
    queryKey: behandlereQueryKeys.behandlerRef(behandlerRef),
    queryFn: fetchBehandlerByBehandlerRef,
    enabled: isEnabled,
  });
};
