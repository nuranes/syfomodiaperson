import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateIkkeAktuellDTO } from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { dialogmotekandidatQueryKeys } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useSettDialogmoteikkeaktuell = () => {
  const queryClient = useQueryClient();

  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/ikkeaktuell/personident`;
  const postSettDialogmoteikkeaktuell = (
    newIkkeAktuellDTO: CreateIkkeAktuellDTO
  ) => post(path, newIkkeAktuellDTO);

  const personident = useValgtPersonident();

  return useMutation({
    mutationFn: postSettDialogmoteikkeaktuell,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmotekandidatQueryKeys.kandidat(personident),
      }),
  });
};
