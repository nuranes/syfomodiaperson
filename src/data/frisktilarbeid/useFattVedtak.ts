import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMutation } from "@tanstack/react-query";
import { ISFRISKTILARBEID_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { VedtakRequestDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";

export const useFattVedtak = () => {
  const personident = useValgtPersonident();
  const path = `${ISFRISKTILARBEID_ROOT}/frisktilarbeid/vedtak`;
  const postVedtak = (vedtak: VedtakRequestDTO) =>
    post(path, vedtak, personident);

  return useMutation({
    mutationFn: postVedtak,
  });
};
