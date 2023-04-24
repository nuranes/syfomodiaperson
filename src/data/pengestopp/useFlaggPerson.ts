import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISPENGESTOPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  Status,
  StatusEndring,
  StoppAutomatikk,
} from "@/data/pengestopp/types/FlaggPerson";
import { pengestoppStatusQueryKeys } from "@/data/pengestopp/pengestoppQueryHooks";

export const useFlaggPerson = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const postFlaggPerson = (stoppAutomatikk: StoppAutomatikk) =>
    post(`${ISPENGESTOPP_ROOT}/person/flagg`, stoppAutomatikk);
  const pengestoppStatusQueryKey =
    pengestoppStatusQueryKeys.pengestoppStatus(fnr);

  return useMutation({
    mutationFn: postFlaggPerson,
    onSuccess: (_, stoppAutomatikk) => {
      const previousStatusEndring =
        queryClient.getQueryData<StatusEndring[]>(pengestoppStatusQueryKey) ||
        [];
      const updatedStatusEndring =
        stoppAutomatikk2StatusEndring(stoppAutomatikk);
      queryClient.setQueryData(pengestoppStatusQueryKey, [
        ...updatedStatusEndring,
        ...previousStatusEndring,
      ]);
    },
    onSettled: () =>
      queryClient.invalidateQueries(pengestoppStatusQueryKey, {
        refetchType: "none",
      }),
  });
};

const stoppAutomatikk2StatusEndring = (
  stoppAutomatikk: StoppAutomatikk
): StatusEndring[] => {
  const { virksomhetNr, sykmeldtFnr, arsakList, enhetNr } = stoppAutomatikk;
  return virksomhetNr.map((virksomhet) => {
    return {
      veilederIdent: { value: "" },
      sykmeldtFnr,
      status: Status.STOPP_AUTOMATIKK,
      arsakList,
      virksomhetNr: virksomhet,
      opprettet: new Date().toISOString(),
      enhetNr,
    };
  });
};
