import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  UnntakDTO,
  UnntaksstatistikkDTO,
} from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";

export const dialogmoteunntakQueryKeys = {
  unntak: (personident: string) => ["dialogmoteunntak", personident],
};

export const useDialogmoteunntakQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`;
  const fetchUnntak = () => get<UnntakDTO[]>(path, personident);
  const query = useQuery({
    queryKey: dialogmoteunntakQueryKeys.unntak(personident),
    queryFn: fetchUnntak,
    enabled: !!personident,
  });

  return {
    ...query,
    data: query.data || [],
  };
};

export const useDialogmoteUnntaksstatistikkQuery = () => {
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/statistikk`;
  const fetchUnntaksstatistikk = () => get<UnntaksstatistikkDTO[]>(path);
  return useQuery({
    queryKey: dialogmotekandidatQueryKeys.unntaksstatistikk(),
    queryFn: fetchUnntaksstatistikk,
  });
};
