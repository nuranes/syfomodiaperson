import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { deleteRequest } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { huskelappQueryKeys } from "@/data/huskelapp/useGetHuskelappQuery";

export const useRemoveHuskelapp = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const deleteHuskelapp = (huskelappUuid: string) => {
    const path = `${ISHUSKELAPP_ROOT}/huskelapp/${huskelappUuid}`;
    return deleteRequest(path, personident);
  };

  return useMutation({
    mutationFn: deleteHuskelapp,
    onSuccess: () => {
      queryClient.invalidateQueries(huskelappQueryKeys.huskelapp(personident));
    },
  });
};
