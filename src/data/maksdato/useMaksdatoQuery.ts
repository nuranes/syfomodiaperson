import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

interface Maksdato {
  maxDate: Date | null;
}

const maksdatoQueryKeys = {
  maksdato: (fnr: string) => ["maksdato", fnr],
};

export const useMaksdatoQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ESYFOVARSEL_ROOT}/sykepenger/maxdate`;
  const fetchMaksdato = () => get<Maksdato>(path, fnr);

  return useQuery({
    queryKey: maksdatoQueryKeys.maksdato(fnr),
    queryFn: fetchMaksdato,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
