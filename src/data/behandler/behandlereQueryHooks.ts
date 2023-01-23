import { get } from "@/api/axios";
import { ISDIALOGMELDING_ROOT } from "@/apiConstants";
import { useQuery } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";

export const behandlereQueryKeys = {
  behandlere: (fnr: string) => ["behandlere", fnr],
};

export const useBehandlereQuery = () => {
  const fnr = useValgtPersonident();
  const fetchBehandlere = () =>
    get<BehandlerDTO[]>(`${ISDIALOGMELDING_ROOT}/behandler/personident`, fnr);
  const query = useQuery(behandlereQueryKeys.behandlere(fnr), fetchBehandlere, {
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

  const query = useQuery(["search", searchstring], sokBehandlere, {
    enabled: !!searchstring,
  });

  return {
    ...query,
    data: query.data || [],
  };
};
