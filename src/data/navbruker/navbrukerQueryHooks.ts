import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { erGyldigFodselsnummer } from "@/utils/frnValideringUtils";
import { minutesToMillis } from "@/utils/timeUtils";

export const brukerinfoQueryKeys = {
  brukerinfo: (personident: string) => ["brukerinfo", personident],
};

export const useBrukerinfoQuery = () => {
  const personident = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/brukerinfo`;
  const fetchBrukerInfo = () => get<BrukerinfoDTO>(path, personident);
  const query = useQuery(
    brukerinfoQueryKeys.brukerinfo(personident),
    fetchBrukerInfo,
    {
      enabled: !!personident && erGyldigFodselsnummer(personident),
      staleTime: minutesToMillis(60 * 12),
    }
  );
  return {
    ...query,
    brukerinfo: query.data || {
      navn: "",
      kontaktinfo: undefined,
      arbeidssituasjon: "ARBEIDSTAKER",
    },
    brukerKanIkkeVarslesDigitalt:
      query.data?.kontaktinfo?.skalHaVarsel === false,
    brukerKanVarslesDigitalt: query.data?.kontaktinfo?.skalHaVarsel === true,
  };
};
