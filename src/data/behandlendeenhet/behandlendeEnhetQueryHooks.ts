import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { BehandlendeEnhet } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { useQuery } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { minutesToMillis } from "@/utils/timeUtils";

export const behandlendeEnhetQueryKeys = {
  behandlendeEnhet: (fnr: string) => ["behandlendeenhet", fnr],
};

export const useBehandlendeEnhetQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/personident`;
  const fetchBehandlendeEnhet = () => get<BehandlendeEnhet>(path, fnr);
  return useQuery({
    queryKey: behandlendeEnhetQueryKeys.behandlendeEnhet(fnr),
    queryFn: fetchBehandlendeEnhet,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
