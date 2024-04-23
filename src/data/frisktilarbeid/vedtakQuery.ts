import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";

export const vedtakQueryKeys = {
  vedtak: (personident: string) => ["frisktilarbeid-vedtak", personident],
};

export const useVedtakQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`;
  const fetchVedtak = () => get<VedtakResponseDTO[]>(path, personident);

  const query = useQuery({
    queryKey: vedtakQueryKeys.vedtak(personident),
    queryFn: fetchVedtak,
    enabled: !!personident,
  });

  return {
    ...query,
    data: query.data || [],
  };
};
