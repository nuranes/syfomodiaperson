import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";

export const useSendVurderingArbeidsuforhet = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`;
  const postForhandsvarsel = (forhandsvarsel: VurderingRequestDTO) =>
    post<VurderingResponseDTO>(path, forhandsvarsel, personident);

  return useMutation({
    mutationFn: postForhandsvarsel,
    onSuccess: (data: VurderingResponseDTO) => {
      queryClient.setQueryData(
        arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
        (oldData: VurderingResponseDTO[]) => [data, ...oldData]
      );
    },
  });
};
