import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISBEHANDLERDIALOG_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { MeldingResponseDTO } from "@/data/behandlerdialog/behandlerdialogTypes";

export const behandlerdialogQueryKeys = {
  behandlerdialog: (personident: string) => ["behandlerdialog", personident],
  vedlegg: (meldingUuid: string, vedleggNumber: number) => [
    "vedlegg",
    meldingUuid,
    vedleggNumber,
  ],
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

export const useBehandlerdialogVedleggQuery = (
  meldingUuid: string,
  vedleggNumber: number,
  skalHenteVedlegg: boolean
) => {
  const personident = useValgtPersonident();
  const path = `${ISBEHANDLERDIALOG_ROOT}/melding/${meldingUuid}/${vedleggNumber}/pdf`;
  const fetchBehandlerdialogVedlegg = () =>
    get<ArrayBuffer>(
      path,
      personident,
      undefined,
      "arraybuffer",
      "application/pdf"
    );

  const query = useQuery({
    queryKey: behandlerdialogQueryKeys.vedlegg(meldingUuid, vedleggNumber),
    queryFn: fetchBehandlerdialogVedlegg,
    enabled: skalHenteVedlegg,
  });

  return {
    ...query,
  };
};
