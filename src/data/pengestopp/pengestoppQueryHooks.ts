import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { StatusEndring } from "@/data/pengestopp/types/FlaggPerson";

export const pengestoppStatusQueryKeys = {
  pengestoppStatus: (fnr: string) => ["pengestoppstatus", fnr],
};

export const usePengestoppStatusQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISPENGESTOPP_ROOT}/person/status`;
  const fetchPengestoppStatus = () => get<StatusEndring[]>(path, fnr);
  const query = useQuery(
    pengestoppStatusQueryKeys.pengestoppStatus(fnr),
    fetchPengestoppStatus,
    {
      enabled: !!fnr,
      staleTime: minutesToMillis(60 * 12),
    }
  );

  return {
    ...query,
    data: query.data || [],
  };
};
