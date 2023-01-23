import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { sorterMotebehovDataEtterDato } from "@/utils/motebehovUtils";

export const motebehovQueryKeys = {
  motebehov: (fnr: string) => ["motebehov", fnr],
};

export const useMotebehovQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOMOTEBEHOV_ROOT}/motebehov?fnr=${fnr}`;
  const fetchMotebehov = () => get<MotebehovVeilederDTO[]>(path);

  const query = useQuery(motebehovQueryKeys.motebehov(fnr), fetchMotebehov, {
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    data: query.data?.sort(sorterMotebehovDataEtterDato) || [],
  };
};
