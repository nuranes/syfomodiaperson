import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { PaminnelseDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { post } from "@/api/axios";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";

export const usePaminnelseTilBehandler = (meldingUuid: string) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISBEHANDLERDIALOG_ROOT}/melding/${meldingUuid}/paminnelse`;

  const postSendPaminnelse = (paminnelse: PaminnelseDTO) =>
    post(path, paminnelse, personident);

  return useMutation({
    mutationFn: postSendPaminnelse,
    onSuccess: () => {
      queryClient.invalidateQueries(
        behandlerdialogQueryKeys.behandlerdialog(personident)
      );
    },
  });
};
