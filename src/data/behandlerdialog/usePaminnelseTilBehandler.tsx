import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { PaminnelseDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { post } from "@/api/axios";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import { postBehandlePersonoppgave } from "@/data/personoppgave/useBehandlePersonoppgave";
import { personoppgaverQueryKeys } from "@/data/personoppgave/personoppgaveQueryHooks";

export const usePaminnelseTilBehandler = (
  meldingUuid: string,
  oppgaveUuid: string
) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISBEHANDLERDIALOG_ROOT}/melding/${meldingUuid}/paminnelse`;

  const sendPaminnelseOgBehandleOppgave = async (paminnelse: PaminnelseDTO) => {
    await post(path, paminnelse, personident);
    await postBehandlePersonoppgave(oppgaveUuid);
  };

  return useMutation({
    mutationFn: sendPaminnelseOgBehandleOppgave,
    onSuccess: () => {
      // Returnerer Promise her slik at mutation er 'loading' til disse queryene er invalidert
      return queryClient
        .invalidateQueries(
          behandlerdialogQueryKeys.behandlerdialog(personident)
        )
        .then(() => {
          return queryClient.invalidateQueries(
            personoppgaverQueryKeys.personoppgaver(personident)
          );
        });
    },
  });
};
