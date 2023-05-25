import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ESYFOVARSEL_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

interface MaksdatoDTO {
  maxDate: Maksdato | null;
}

interface Maksdato {
  id: string;
  fnr: string;
  forelopig_beregnet_slutt: Date;
  utbetalt_tom: Date;
  gjenstaende_sykedager: string;
  opprettet: Date;
}

const maksdatoQueryKeys = {
  maksdato: (fnr: string) => ["maksdato", fnr],
};

export const useMaksdatoQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ESYFOVARSEL_ROOT}/sykepenger/maxdate`;
  const fetchMaksdato = () => get<MaksdatoDTO>(path, fnr);

  return useQuery({
    queryKey: maksdatoQueryKeys.maksdato(fnr),
    queryFn: fetchMaksdato,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
