import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { huskelappQueryKeys } from "@/data/huskelapp/useGetHuskelappQuery";
import { HuskelappRequestDTO } from "@/data/huskelapp/huskelappTypes";

export const useOppdaterHuskelapp = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const postHuskelapp = (nyHuskelapp: HuskelappRequestDTO) =>
    post<HuskelappRequestDTO>(path, nyHuskelapp, personident);

  return useMutation({
    mutationFn: postHuskelapp,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: huskelappQueryKeys.huskelapp(personident),
      });
    },
  });
};
