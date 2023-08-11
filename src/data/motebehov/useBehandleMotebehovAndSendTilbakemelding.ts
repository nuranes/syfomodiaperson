import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOMOTEBEHOV_ROOT } from "@/apiConstants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { post } from "@/api/axios";
import { motebehovQueryKeys } from "@/data/motebehov/motebehovQueryHooks";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { MotebehovVeilederDTO } from "@/data/motebehov/types/motebehovTypes";

export interface MotebehovTilbakemeldingDTO {
  varseltekst: string;
  motebehovId: string;
}

export const useBehandleMotebehovAndSendTilbakemelding = () => {
  const fnr = useValgtPersonident();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const veilederIdent = veilederinfo?.ident;
  const queryClient = useQueryClient();
  const path = `${SYFOMOTEBEHOV_ROOT}/motebehov/${fnr}/behandle`;
  const pathTilbakemelding = `${SYFOMOTEBEHOV_ROOT}/motebehov/tilbakemelding`;

  const behandleMotebehovAndSendTilbakemelding = async (
    tilbakemeldinger: MotebehovTilbakemeldingDTO[]
  ) => {
    await post(path, {});
    await Promise.all(
      tilbakemeldinger.map((tilbakemelding) =>
        post(pathTilbakemelding, tilbakemelding)
      )
    );
  };
  const motebehovQueryKey = motebehovQueryKeys.motebehov(fnr);

  return useMutation({
    mutationFn: behandleMotebehovAndSendTilbakemelding,
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
      queryClient.invalidateQueries(motebehovQueryKey, {
        refetchType: "none",
      }),
  });
};
