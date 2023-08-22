import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { ReturLegeerklaringDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { post } from "@/api/axios";
import { behandlerdialogQueryKeys } from "@/data/behandlerdialog/behandlerdialogQueryHooks";

export const useReturLegeerklaring = (legeerklaringUuid: string) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISBEHANDLERDIALOG_ROOT}/melding/${legeerklaringUuid}/retur`;

  const postReturLegeerklaring = async (
    returLegeerklaring: ReturLegeerklaringDTO
  ) => {
    await post(path, returLegeerklaring, personident);
  };

  return useMutation({
    mutationFn: postReturLegeerklaring,
    onSuccess: () => {
      return queryClient.invalidateQueries(
        behandlerdialogQueryKeys.behandlerdialog(personident)
      );
    },
  });
};
