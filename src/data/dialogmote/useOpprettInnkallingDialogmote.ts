import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { DialogmoteInnkallingDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dialogmoterQueryKeys } from "@/data/dialogmote/dialogmoteQueryHooks";

export const useOpprettInnkallingDialogmote = (fnr: string) => {
  const queryClient = useQueryClient();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/personident`;
  const postOpprettInnkalling = (innkalling: DialogmoteInnkallingDTO) =>
    post(path, innkalling, fnr);

  return useMutation(postOpprettInnkalling, {
    onSettled: () =>
      queryClient.invalidateQueries(dialogmoterQueryKeys.dialogmoter(fnr)),
  });
};
