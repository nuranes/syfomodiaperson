import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { post } from "@/api/axios";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";

export const useMeldingTilBehandler = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISBEHANDLERDIALOG_ROOT}/melding`;
  const postSendDialogmelding = (meldingTilBehandler: MeldingTilBehandlerDTO) =>
    post(path, meldingTilBehandler, personident);

  return useMutation(postSendDialogmelding, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        behandlerdialogQueryKeys.behandlerdialog(personident)
      );
    },
  });
};
