import { ISNARMESTELEDER_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import { useMemo } from "react";
import {
  NarmesteLederRelasjonDTO,
  NarmesteLederRelasjonStatus,
} from "@/data/leder/ledereTypes";
import { capitalizeAllWords } from "@/utils/stringUtils";

export const ledereQueryKeys = {
  ledere: (fnr: string) => ["ledere", fnr],
};

export const ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH =
  "/narmestelederrelasjon/personident";

export const useLedereQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISNARMESTELEDER_ROOT}${ISNARMESTELEDER_NARMESTELEDERRELASJON_PERSONIDENT_PATH}`;
  const fetchLedere = () => get<NarmesteLederRelasjonDTO[]>(path, fnr);
  const query = useQuery({
    queryKey: ledereQueryKeys.ledere(fnr),
    queryFn: fetchLedere,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
  });
  const currentLedere = useMemo(
    () =>
      query.data?.filter(
        (leder) => leder.status === NarmesteLederRelasjonStatus.INNMELDT_AKTIV
      ) || [],
    [query.data]
  ).map((leder) => ({
    ...leder,
    narmesteLederNavn: capitalizeAllWords(leder.narmesteLederNavn),
  }));
  const getCurrentNarmesteLeder = (
    virksomhetsnummer: string
  ): NarmesteLederRelasjonDTO | undefined => {
    return currentLedere.find(
      (leder) => leder.virksomhetsnummer === virksomhetsnummer
    );
  };

  return {
    ...query,
    getCurrentNarmesteLeder,
    currentLedere,
    formerLedere: useMemo(
      () =>
        query.data?.filter(
          (leder) => leder.status !== NarmesteLederRelasjonStatus.INNMELDT_AKTIV
        ) || [],
      [query.data]
    ),
    allLedere: query.data || [],
  };
};
