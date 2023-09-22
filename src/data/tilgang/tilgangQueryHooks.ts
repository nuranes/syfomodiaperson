import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISTILGANGSKONTROLL_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Tilgang } from "@/data/tilgang/tilgangTypes";

export const tilgangQueryKeys = {
  tilgang: (fnr: string) => ["tilgang", fnr],
};

export const useTilgangQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISTILGANGSKONTROLL_ROOT}/tilgang/navident/person`;
  const fetchTilgang = () => get<Tilgang>(path, fnr);
  return useQuery({
    queryKey: tilgangQueryKeys.tilgang(fnr),
    queryFn: fetchTilgang,
    enabled: !!fnr,
  });
};
