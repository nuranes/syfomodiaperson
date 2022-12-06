import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useQuery } from "react-query";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

export const aktivitetskravQueryKeys = {
  aktivitetskrav: (personident: string) => ["aktivitetskrav", personident],
};

export const useAktivitetskravQuery = () => {
  const { isFeatureEnabled } = useFeatureToggles();
  const isAktivitetskravEnabled = isFeatureEnabled(ToggleNames.aktivitetskrav);
  const personident = useValgtPersonident();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/personident`;
  const fetchAktivitetskrav = () => get<AktivitetskravDTO[]>(path, personident);

  return useQuery(
    aktivitetskravQueryKeys.aktivitetskrav(personident),
    fetchAktivitetskrav,
    { enabled: !!personident && isAktivitetskravEnabled }
  );
};
