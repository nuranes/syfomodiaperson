import { SYFOSMREGISTER_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get } from "@/api/axios";
import { SykmeldingNewFormatDTO } from "@/data/sykmelding/types/SykmeldingNewFormatDTO";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { useMemo } from "react";
import {
  newSMFormat2OldFormat,
  oldFormatSMForAG,
} from "@/utils/sykmeldinger/sykmeldingParser";

export const sykmeldingerQueryKeys = {
  sykmeldinger: (fnr: string) => ["sykmeldinger", fnr],
};

export const useSykmeldingerQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOSMREGISTER_ROOT}/internal/sykmeldinger`;
  const fetchSykmeldinger = () => get<SykmeldingNewFormatDTO[]>(path, fnr);
  const query = useQuery({
    queryKey: sykmeldingerQueryKeys.sykmeldinger(fnr),
    queryFn: fetchSykmeldinger,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });

  return {
    ...query,
    sykmeldinger: useMemo(
      () =>
        query.data?.map((sykmelding) =>
          newSMFormat2OldFormat(sykmelding, fnr)
        ) || [],
      [fnr, query.data]
    ),
    arbeidsgiverssykmeldinger: useMemo(
      () =>
        query.data?.map((sykmelding) => oldFormatSMForAG(sykmelding, fnr)) ||
        [],
      [fnr, query.data]
    ),
  };
};
