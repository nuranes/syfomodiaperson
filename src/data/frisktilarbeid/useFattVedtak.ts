import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import {
  VedtakRequestDTO,
  VedtakResponseDTO,
} from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";

export const useFattVedtak = () => {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`;
  const postVedtak = (vedtak: VedtakRequestDTO) =>
    post<VedtakResponseDTO>(path, vedtak, personident);

  return useMutation({
    mutationFn: postVedtak,
    onSuccess: (data: VedtakResponseDTO) => {
      queryClient.setQueryData(
        vedtakQueryKeys.vedtak(personident),
        (oldData: VedtakResponseDTO[]) => [data, ...oldData]
      );
    },
  });
};
