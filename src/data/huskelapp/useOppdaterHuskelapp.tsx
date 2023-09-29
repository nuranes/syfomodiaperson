import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { HuskelappDTO } from "@/data/huskelapp/huskelappTypes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { huskelappQueryKeys } from "@/data/huskelapp/useGetHuskelappQuery";

export const useOppdaterHuskelapp = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const postHuskelapp = (nyHuskelapp: HuskelappDTO) =>
    post<HuskelappDTO>(path, nyHuskelapp, personident);

  return useMutation({
    mutationFn: postHuskelapp,
    onSuccess: () => {
      queryClient.invalidateQueries(huskelappQueryKeys.huskelapp(personident));
    },
  });
};
