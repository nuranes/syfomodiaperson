import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { NewDialogmoteReferatDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

export const useFerdigstillDialogmote = (
  fnr: string,
  dialogmoteUuid: string
) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/ferdigstill`;
  const postFerdigstillDialogmote = (referat: NewDialogmoteReferatDTO) =>
    post(path, referat);

  return useMutation(postFerdigstillDialogmote, {
    onSettled: () =>
      queryClient.invalidateQueries(dialogmoterQueryKeys.dialogmoter(fnr)),
  });
};
