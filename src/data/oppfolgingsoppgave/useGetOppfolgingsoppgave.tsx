import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISHUSKELAPP_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { OppfolgingsoppgaveResponseDTO } from "@/data/oppfolgingsoppgave/types";

export const oppfolgingsoppgaveQueryKeys = {
  oppfolgingsoppgave: (personident: string) => [
    "oppfolgingsoppgave",
    personident,
  ],
};

export const useGetOppfolgingsoppgave = () => {
  const personident = useValgtPersonident();
  const path = `${ISHUSKELAPP_ROOT}/huskelapp`;
  const getOppfolgingsoppgave = () =>
    get<OppfolgingsoppgaveResponseDTO>(path, personident);

  const {
    data: oppfolgingsoppgave,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: oppfolgingsoppgaveQueryKeys.oppfolgingsoppgave(personident),
    queryFn: getOppfolgingsoppgave,
    enabled: !!personident,
  });

  return {
    oppfolgingsoppgave: oppfolgingsoppgave,
    isSuccess,
    isLoading,
    isError,
  };
};
