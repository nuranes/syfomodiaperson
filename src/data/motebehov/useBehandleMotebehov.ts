import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";

export const useBehandleMotebehov = () => {
  const fnr = useValgtPersonident();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const veilederIdent = veilederinfo?.ident;
  const queryClient = useQueryClient();
  const path = `${SYFOMOTEBEHOV_ROOT}/motebehov/behandle`;
  const postBehandleMotebehov = () => post(path, {}, fnr);
  const motebehovQueryKey = motebehovQueryKeys.motebehov(fnr);

  return useMutation({
    mutationFn: postBehandleMotebehov,
    onSuccess: () => {
      const previousMotebehov =
        queryClient.getQueryData<MotebehovVeilederDTO[]>(motebehovQueryKey);
      if (previousMotebehov && veilederIdent) {
        queryClient.setQueryData(
          motebehovQueryKey,
          previousMotebehov.map((motebehov) => ({
            ...motebehov,
            behandletTidspunkt: new Date(),
            behandletVeilederIdent: veilederIdent,
          }))
        );
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: motebehovQueryKey,
        refetchType: "none",
      }),
  });
};
