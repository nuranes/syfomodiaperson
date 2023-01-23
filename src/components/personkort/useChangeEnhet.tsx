import { SYFOBEHANDLENDEENHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PersonDTO } from "@/data/behandlendeenhet/types/BehandlendeEnhet";
import { behandlendeEnhetQueryKeys } from "@/data/behandlendeenhet/behandlendeEnhetQueryHooks";

export const useChangeEnhet = (fnr: string) => {
  const queryClient = useQueryClient();
  const path = `${SYFOBEHANDLENDEENHET_ROOT}/person`;
  const postChangeEnhet = (person: PersonDTO) => post<PersonDTO>(path, person);
  const behandlendeEnhetQueryKey =
    behandlendeEnhetQueryKeys.behandlendeEnhet(fnr);

  return useMutation(postChangeEnhet, {
    onSuccess: (data: PersonDTO) => {
      queryClient.setQueryData(behandlendeEnhetQueryKey, data);
    },
    onSettled: () => queryClient.invalidateQueries(behandlendeEnhetQueryKey),
  });
};
