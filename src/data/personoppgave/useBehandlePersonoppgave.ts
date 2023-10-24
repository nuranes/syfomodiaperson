import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISPERSONOPPGAVE_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { BehandlePersonoppgaveRequestDTO } from "@/data/personoppgave/types/BehandlePersonoppgaveRequestDTO";

export const postBehandlePersonoppgave = (uuid: string) =>
  post(`${ISPERSONOPPGAVE_ROOT}/personoppgave/${uuid}/behandle`, {});

export const useBehandlePersonoppgave = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const personOppgaverQueryKey = personoppgaverQueryKeys.personoppgaver(fnr);

  return useMutation({
    mutationFn: postBehandlePersonoppgave,
    onSettled: () => queryClient.invalidateQueries(personOppgaverQueryKey),
  });
};

export const useBehandlePersonoppgaveWithoutRefetch = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const personOppgaverQueryKey = personoppgaverQueryKeys.personoppgaver(fnr);
  return useMutation({
    mutationFn: postBehandlePersonoppgave,
    onSuccess: () =>
      queryClient.invalidateQueries(personOppgaverQueryKey, {
        refetchType: "none",
      }),
  });
};

export const useBehandleAllPersonoppgaver = () => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const postBehandlePersonoppgaver = (
    behandlePersonoppgaverRequestDTO: BehandlePersonoppgaveRequestDTO
  ) =>
    post(
      `${ISPERSONOPPGAVE_ROOT}/personoppgave/behandle`,
      behandlePersonoppgaverRequestDTO
    );
  const personOppgaverQueryKey = personoppgaverQueryKeys.personoppgaver(fnr);

  return useMutation({
    mutationFn: postBehandlePersonoppgaver,
    onSettled: () => queryClient.invalidateQueries(personOppgaverQueryKey),
  });
};
