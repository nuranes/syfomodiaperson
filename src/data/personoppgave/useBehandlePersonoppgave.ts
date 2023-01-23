import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useBehandlePersonoppgave = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const postBehandlePersonoppgave = (uuid: string) =>
    post(`${ISPERSONOPPGAVE_ROOT}/personoppgave/${uuid}/behandle`, {});
  const personOppgaverQueryKey = personoppgaverQueryKeys.personoppgaver(fnr);

  return useMutation(postBehandlePersonoppgave, {
    onSettled: () => queryClient.invalidateQueries(personOppgaverQueryKey),
  });
};
