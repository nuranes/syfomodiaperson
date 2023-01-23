import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { AvlysDialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

export const useAvlysDialogmote = (fnr: string, dialogmoteUuid: string) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/avlys`;
  const postAvlysDialogmote = (avlysning: AvlysDialogmoteDTO) =>
    post(path, avlysning);

  return useMutation(postAvlysDialogmote, {
    onSettled: () =>
      queryClient.invalidateQueries(dialogmoterQueryKeys.dialogmoter(fnr)),
  });
};
