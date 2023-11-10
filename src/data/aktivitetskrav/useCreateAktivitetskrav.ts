import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISAKTIVITETSKRAV_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { aktivitetskravQueryKeys } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { useValgtPersonident } from "@/hooks/useValgtBruker";

export const useCreateAktivitetskrav = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISAKTIVITETSKRAV_ROOT}/aktivitetskrav`;
  const postAktivitetskrav = () => post(path, {}, personident);

  return useMutation({
    mutationFn: postAktivitetskrav,
    onSuccess: () => {
      return queryClient.invalidateQueries(
        aktivitetskravQueryKeys.aktivitetskrav(personident)
      );
    },
  });
};
