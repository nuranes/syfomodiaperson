import { useQuery } from "react-query";
import { get } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISOPPFOLGINGSTILFELLE_ROOT } from "@/apiConstants";
import {
  OppfolgingstilfelleDTO,
  OppfolgingstilfellePersonDTO,
} from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { minutesToMillis } from "@/utils/timeUtils";
import dayjs from "dayjs";

const ARBEIDSGIVERPERIODE_DAYS = 16;

const latestTilfelleDifference = (
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
) => {
  return new Date(b.start).getTime() - new Date(a.start).getTime();
};

const longestTilfelleDifference = (
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
) => {
  return new Date(b.end).getTime() - new Date(a.end).getTime();
};

const byLatestAndLongestTilfelle = (
  a: OppfolgingstilfelleDTO,
  b: OppfolgingstilfelleDTO
) => {
  const startDateDifference = latestTilfelleDifference(a, b);
  if (startDateDifference === 0) {
    return longestTilfelleDifference(a, b);
  }
  return startDateDifference;
};

const sortByDescendingStart = (
  oppfolgingstilfelleList: OppfolgingstilfelleDTO[]
): OppfolgingstilfelleDTO[] => {
  return oppfolgingstilfelleList.sort(byLatestAndLongestTilfelle);
};

const isInactive = (oppfolgingstilfelle: OppfolgingstilfelleDTO) => {
  const today = dayjs(new Date());
  const tilfelleEnd = dayjs(oppfolgingstilfelle.end);

  return today.isAfter(
    tilfelleEnd.add(ARBEIDSGIVERPERIODE_DAYS, "days"),
    "date"
  );
};

export const oppfolgingstilfellePersonQueryKeys = {
  oppfolgingstilfelleperson: (personIdent: string) => [
    "oppfolgingstilfelleperson",
    personIdent,
  ],
};

export const useOppfolgingstilfellePersonQuery = () => {
  const personIdent = useValgtPersonident();
  const path = `${ISOPPFOLGINGSTILFELLE_ROOT}/oppfolgingstilfelle/personident`;
  const fetchOppfolgingstilfellePerson = () =>
    get<OppfolgingstilfellePersonDTO>(path, personIdent);
  const query = useQuery(
    oppfolgingstilfellePersonQueryKeys.oppfolgingstilfelleperson(personIdent),
    fetchOppfolgingstilfellePerson,
    {
      enabled: !!personIdent,
      staleTime: minutesToMillis(60 * 12),
    }
  );
  const latestOppfolgingstilfelle =
    query.data && sortByDescendingStart(query.data.oppfolgingstilfelleList)[0];
  return {
    ...query,
    latestOppfolgingstilfelle,
    hasActiveOppfolgingstilfelle:
      !!latestOppfolgingstilfelle && !isInactive(latestOppfolgingstilfelle),
  };
};

export const useStartOfLatestOppfolgingstilfelle = (): Date | undefined => {
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  return latestOppfolgingstilfelle?.start;
};
