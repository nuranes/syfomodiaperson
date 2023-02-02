import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { CreateAktivitetskravVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { post } from "@/api/axios";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useVurderAktivitetskrav = (
  aktivitetskravUuid: string | undefined
) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = aktivitetskravUuid
    ? `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/${aktivitetskravUuid}/vurder`
    : `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/vurder`;
  const postVurderAktivitetskrav = (
    vurdering: CreateAktivitetskravVurderingDTO
  ) => post(path, vurdering, personident);

  return useMutation(postVurderAktivitetskrav, {
    onSuccess: () => {
      return queryClient.invalidateQueries(
        aktivitetskravQueryKeys.aktivitetskrav(personident)
      );
    },
  });
};
