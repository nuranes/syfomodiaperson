import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { put } from "@/api/axios";
import { vedtakQueryKeys } from "@/data/frisktilarbeid/vedtakQuery";

export function useFerdigbehandleVedtak(vedtakUUID: string) {
  const personident = useValgtPersonident();
  const queryClient = useQueryClient();
  const path = `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak/${vedtakUUID}/ferdigbehandling`;
  const putFerdigbehandle = () =>
    put<VedtakResponseDTO>(path, undefined, personident);

  return useMutation({
    mutationFn: putFerdigbehandle,
    onSuccess: (data: VedtakResponseDTO) => {
      queryClient.setQueryData(
        vedtakQueryKeys.vedtak(personident),
        (oldData: VedtakResponseDTO[]) => [data, ...oldData.slice(1)]
      );
    },
  });
}
