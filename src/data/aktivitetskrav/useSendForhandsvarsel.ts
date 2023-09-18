import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { SendForhandsvarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { post } from "@/api/axios";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useSendForhandsvarsel = (
  aktivitetskravUuid: string | undefined
) => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav/${aktivitetskravUuid}/forhandsvarsel`;
  const postVurderAktivitetskrav = (forhandsvarsel: SendForhandsvarselDTO) =>
    post(path, forhandsvarsel, personident);

  return useMutation({
    mutationFn: postVurderAktivitetskrav,
    onSuccess: () => {
      return queryClient.invalidateQueries(
        aktivitetskravQueryKeys.aktivitetskrav(personident)
      );
    },
  });
};
