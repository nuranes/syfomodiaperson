import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  AktivitetskravDTO,
  AktivitetskravHistorikkDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useQuery } from "@tanstack/react-query";

export const aktivitetskravQueryKeys = {
  aktivitetskrav: (personident: string) => ["aktivitetskrav", personident],
  historikk: (personident: string) => ["historikk", personident],
};

export const useAktivitetskravQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`;
  const fetchAktivitetskrav = () => get<AktivitetskravDTO[]>(path, personident);

  const query = useQuery({
    queryKey: aktivitetskravQueryKeys.aktivitetskrav(personident),
    queryFn: fetchAktivitetskrav,
    enabled: !!personident,
  });

  return {
    ...query,
    data: query.data || [],
  };
};

export const useAktivitetskravHistorikkQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/historikk`;
  const fetchAktivitetskravHistorikk = () =>
    get<AktivitetskravHistorikkDTO[]>(path, personident);

  return useQuery({
    queryKey: aktivitetskravQueryKeys.historikk(personident),
    queryFn: fetchAktivitetskravHistorikk,
    enabled: !!personident,
  });
};
