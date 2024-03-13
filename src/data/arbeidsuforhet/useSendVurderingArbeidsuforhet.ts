import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { VurderingRequestDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";

export const useSendVurderingArbeidsuforhet = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`;
  const postForhandsvarsel = (forhandsvarsel: VurderingRequestDTO) =>
    post(path, forhandsvarsel, personident);

  return useMutation({
    mutationFn: postForhandsvarsel,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
      });
    },
  });
};
