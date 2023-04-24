import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useSettDialogmoteunntak = () => {
  const queryClient = useQueryClient();

  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/unntak/personident`;
  const postSettDialogmoteunntak = (newUnntakDTO: CreateUnntakDTO) =>
    post(path, newUnntakDTO);

  const personident = useValgtPersonident();

  return useMutation({
    mutationFn: postSettDialogmoteunntak,
    onSettled: () =>
      queryClient.invalidateQueries(
        dialogmotekandidatQueryKeys.kandidat(personident)
      ),
  });
};
