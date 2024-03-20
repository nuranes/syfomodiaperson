import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { post } from "@/api/axios";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import {
  VurderingRequestDTO,
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { arbeidsuforhetQueryKeys } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  personoppgaverQueryKeys,
  usePersonoppgaverQuery,
} from "@/data/personoppgave/personoppgaveQueryHooks";
import {
  PersonOppgave,
  PersonOppgaveType,
} from "@/data/personoppgave/types/PersonOppgave";
import { useAktivVeilederinfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";

export const useSendVurderingArbeidsuforhet = () => {
  const personident = useValgtPersonident();
  const { data: veilederinfo } = useAktivVeilederinfoQuery();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const queryClient = useQueryClient();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurderinger`;
  const postForhandsvarsel = (forhandsvarsel: VurderingRequestDTO) =>
    post<VurderingResponseDTO>(path, forhandsvarsel, personident);
  const ubehandletVurderAvslagOppgave: PersonOppgave | undefined =
    getAllUbehandledePersonOppgaver(
      oppgaver,
      PersonOppgaveType.ARBEIDSUFORHET_VURDER_AVSLAG
    )[0];

  const behandleVurderAvslagOppgave = (type: VurderingType) => {
    if (!ubehandletVurderAvslagOppgave) {
      return false;
    }

    switch (type) {
      case VurderingType.OPPFYLT:
      case VurderingType.AVSLAG:
        return true;
      case VurderingType.FORHANDSVARSEL:
        return false;
    }
  };

  return useMutation({
    mutationFn: postForhandsvarsel,
    onSuccess: (data: VurderingResponseDTO, variables: VurderingRequestDTO) => {
      queryClient.setQueryData(
        arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
        (oldData: VurderingResponseDTO[]) => [data, ...oldData]
      );
      if (behandleVurderAvslagOppgave(variables.type)) {
        queryClient.setQueryData(
          personoppgaverQueryKeys.personoppgaver(personident),
          (oldData: PersonOppgave[]) =>
            oldData.map((oppgave) => {
              if (oppgave.uuid === ubehandletVurderAvslagOppgave.uuid) {
                return {
                  ...oppgave,
                  behandletTidspunkt: new Date(),
                  behandletVeilederIdent: veilederinfo?.ident,
                };
              } else {
                return oppgave;
              }
            })
        );
      }
    },
  });
};
