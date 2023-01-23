import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import { minutesToMillis } from "@/utils/timeUtils";
import { DokumentinfoDTO } from "@/data/oppfolgingsplan/types/DokumentinfoDTO";
import { useMemo } from "react";
import { OppfolgingsplanDTO } from "@/data/oppfolgingsplan/types/OppfolgingsplanDTO";

export const oppfolgingsplanQueryKeys = {
  oppfolgingsplaner: (fnr: string) => ["oppfolgingsplaner", fnr],
  oppfolgingsplanerLPS: (fnr: string) => ["oppfolgingsplanerLPS", fnr],
  dokumentinfo: (id: number) => ["dokumentinfo", id],
};

export const useOppfolgingsplanerQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/${fnr}`;
  const fetchOppfolgingsplaner = () => get<OppfolgingsplanDTO[]>(path, fnr);
  const query = useQuery(
    oppfolgingsplanQueryKeys.oppfolgingsplaner(fnr),
    fetchOppfolgingsplaner,
    {
      enabled: !!fnr,
      staleTime: minutesToMillis(60 * 12),
    }
  );

  return {
    ...query,
    data: query.data || [],
    aktivePlaner: useMemo(
      () =>
        query.data?.filter(
          (plan) =>
            plan.status !== "AVBRUTT" &&
            new Date(plan.godkjentPlan.gyldighetstidspunkt.tom) > new Date()
        ) || [],
      [query.data]
    ),
  };
};

export const useOppfolgingsplanerLPSQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/oppfolgingsplan/lps`;
  const fetchOppfolgingsplanerLPS = () => get<OppfolgingsplanLPS[]>(path, fnr);
  const query = useQuery(
    oppfolgingsplanQueryKeys.oppfolgingsplanerLPS(fnr),
    fetchOppfolgingsplanerLPS,
    {
      enabled: !!fnr,
      staleTime: minutesToMillis(60 * 12),
    }
  );

  return {
    ...query,
    data: query.data || [],
  };
};

export const useDokumentinfoQuery = (oppfolgingsplanId: number) => {
  const path = `${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/${oppfolgingsplanId}/dokumentinfo`;
  const fetchDokumentinfo = () => get<DokumentinfoDTO>(path);
  return useQuery(
    oppfolgingsplanQueryKeys.dokumentinfo(oppfolgingsplanId),
    fetchDokumentinfo,
    {
      staleTime: minutesToMillis(60 * 12),
    }
  );
};
