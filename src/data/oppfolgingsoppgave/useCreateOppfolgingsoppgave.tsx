import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { oppfolgingsoppgaveQueryKeys } from "@/data/oppfolgingsoppgave/useGetOppfolgingsoppgave";
import { OppfolgingsoppgaveRequestDTO } from "@/data/oppfolgingsoppgave/types";

export const useCreateOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const postOppfolgingsoppgave = (
    nyOppfolgingsoppgave: OppfolgingsoppgaveRequestDTO
  ) =>
    post<OppfolgingsoppgaveRequestDTO>(path, nyOppfolgingsoppgave, personident);

  return useMutation({
    mutationFn: postOppfolgingsoppgave,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: oppfolgingsoppgaveQueryKeys.oppfolgingsoppgave(personident),
      });
    },
  });
};
