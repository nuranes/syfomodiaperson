import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { MeldingResponseDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

export const behandlerdialogQueryKeys = {
  behandlerdialog: (personident: string) => ["behandlerdialog", personident],
};

export const useBehandlerdialogQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISBEHANDLERDIALOG_ROOT}/melding`;
  const fetchBehandlerdialog = () => get<MeldingResponseDTO>(path, personident);

  const query = useQuery({
    queryKey: behandlerdialogQueryKeys.behandlerdialog(personident),
    queryFn: fetchBehandlerdialog,
    enabled: !!personident,
  });

  return {
    ...query,
    data: query.data,
  };
};
