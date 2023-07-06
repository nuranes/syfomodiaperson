import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { PersonAdresse } from "@/data/personinfo/types/PersonAdresse";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

export const personinfoQueryKeys = {
  personadresse: (fnr: string) => ["personadresse", fnr],
};

export const usePersonAdresseQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/adresse`;
  const fetchPersonAdresse = () => get<PersonAdresse>(path, fnr);
  return useQuery({
    queryKey: personinfoQueryKeys.personadresse(fnr),
    queryFn: fetchPersonAdresse,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
};
