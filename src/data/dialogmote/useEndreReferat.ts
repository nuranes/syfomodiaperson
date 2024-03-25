import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { NewDialogmoteReferatDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useEndreReferat = (dialogmoteUuid: string) => {
  const fnr = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/endreferdigstilt`;
  const postEndreFerdigstilt = (referat: NewDialogmoteReferatDTO) =>
    post(path, referat);

  return useMutation({
    mutationFn: postEndreFerdigstilt,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: dialogmoterQueryKeys.dialogmoter(fnr),
      }),
  });
};
