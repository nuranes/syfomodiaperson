import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useQuery } from "@tanstack/react-query";

export const aktivitetskravQueryKeys = {
  aktivitetskrav: (personident: string) => ["aktivitetskrav", personident],
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
