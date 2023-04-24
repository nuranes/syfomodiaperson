import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { EndreTidStedDialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

export const useEndreTidStedDialogmote = (
  fnr: string,
  dialogmoteUuid: string
) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/${dialogmoteUuid}/tidsted`;
  const postEndreTidSted = (endring: EndreTidStedDialogmoteDTO) =>
    post(path, endring);

  return useMutation({
    mutationFn: postEndreTidSted,
    onSettled: () =>
      queryClient.invalidateQueries(dialogmoterQueryKeys.dialogmoter(fnr)),
  });
};
