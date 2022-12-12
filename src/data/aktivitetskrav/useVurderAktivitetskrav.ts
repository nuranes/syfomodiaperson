import { useMutation, useQueryClient } from "react-query";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { CreateAktivitetskravVurderingDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { post } from "@/api/axios";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useVurderAktivitetskrav = (aktivitetskravUuid: string) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/${aktivitetskravUuid}/vurder`;
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
