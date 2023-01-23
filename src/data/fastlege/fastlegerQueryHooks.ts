import { FASTLEGEREST_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { Fastlege, RelasjonKodeVerdi } from "@/data/fastlege/types/Fastlege";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { minutesToMillis } from "@/utils/timeUtils";

export const fastlegerQueryKeys = {
  fastleger: (fnr: string) => ["fastleger", fnr],
};

export const useFastlegerQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${FASTLEGEREST_ROOT}/fastleger`;
  const fetchFastleger = () => get<Fastlege[]>(path, fnr);
  const query = useQuery(fastlegerQueryKeys.fastleger(fnr), fetchFastleger, {
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    data: query.data || [],
    ikkeFunnet: query.data && query.data.length === 0,
    fastlege: useMemo(
      () =>
        query.data?.find(
          (fastlege) =>
            fastlege.relasjon.kodeVerdi === RelasjonKodeVerdi.FASTLEGE
        ),
      [query.data]
    ),
    fastlegeVikarer: useMemo(
      () =>
        query.data?.filter(
          (fastlege) => fastlege.relasjon.kodeVerdi === RelasjonKodeVerdi.VIKAR
        ) || [],
      [query.data]
    ),
  };
};
