import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ForhandsvarselRequestDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";

export const useSendForhandsvarsel = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/forhandsvarsel`;
  const postForhandsvarsel = (forhandsvarsel: ForhandsvarselRequestDTO) =>
    post(path, forhandsvarsel, personident);

  return useMutation({
    mutationFn: postForhandsvarsel,
    onSuccess: (data) => {
      queryClient.setQueryData(
        arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
        data
      );
    },
  });
};
