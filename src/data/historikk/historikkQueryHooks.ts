import {
  SYFOMOTEBEHOV_ROOT,
  SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT,
} from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  HistorikkEvent,
  HistorikkKilde,
} from "@/data/historikk/types/historikkTypes";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

export const historikkQueryKeys = {
  motebehov: (fnr: string) => ["historikk", "motebehov", fnr],
  oppfolgingsplan: (fnr: string) => ["historikk", "oppfolgingsplan", fnr],
};

export const useHistorikkMotebehovQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOMOTEBEHOV_ROOT}/historikk`;
  const fetchHistorikkMotebehov = () => get<HistorikkEvent[]>(path, fnr);
  const query = useQuery({
    queryKey: historikkQueryKeys.motebehov(fnr),
    queryFn: fetchHistorikkMotebehov,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    data: mapHistorikkEvents(query.data || [], "MOTEBEHOV"),
  };
};

export const useHistorikkOppfolgingsplan = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_V3_ROOT}/oppfolgingsplan/historikk`;
  const fetchHistorikkOppfolgingsplan = () => get<HistorikkEvent[]>(path, fnr);
  const query = useQuery({
    queryKey: historikkQueryKeys.oppfolgingsplan(fnr),
    queryFn: fetchHistorikkOppfolgingsplan,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    data: mapHistorikkEvents(query.data || [], "OPPFOLGINGSPLAN"),
  };
};

export const mapHistorikkEvents = (
  events: HistorikkEvent[],
  kilde: HistorikkKilde
): HistorikkEvent[] =>
  events.map((event) => ({
    ...event,
    kilde,
  }));
