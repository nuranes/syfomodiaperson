import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useValgtEnhet } from "@/context/ValgtEnhetContext";
import { get } from "@/api/axios";
import { defaultToggles, Toggles } from "@/data/unleash/unleash_types";
import { useQuery } from "@tanstack/react-query";
import { UNLEASH_ROOT } from "@/apiConstants";

export const unleashQueryKeys = {
  toggles: (valgtEnhet: string, veilederIdent: string) => [
    "toggles",
    valgtEnhet,
    veilederIdent,
  ],
};

export const useFeatureToggles = () => {
  const { data: veilederInfo } = useAktivVeilederinfoQuery();
  const { valgtEnhet } = useValgtEnhet();
  const veilederIdent = veilederInfo?.ident || "";
  const path = `${UNLEASH_ROOT}/toggles`;
  const queryParameters = `?enhetId=${valgtEnhet}${
    veilederIdent ? `&veilederId=${veilederIdent}` : ""
  }`;
  const fetchToggles = () => get<Toggles>(path + queryParameters);
  const {
    data: togglesResponse,
    refetch: refreshToggles,
    isLoading: isLoading,
    isSuccess: isSuccess,
  } = useQuery({
    queryKey: unleashQueryKeys.toggles(valgtEnhet, veilederIdent),
    queryFn: fetchToggles,
    enabled: !!valgtEnhet || !!veilederIdent,
  });
  const toggles = togglesResponse ?? defaultToggles;

  return {
    toggles,
    refreshToggles,
    isLoading,
    isSuccess,
  };
};
