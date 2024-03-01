import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { ISARBEIDSUFORHET_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { ForhandsvarselRequestDTO } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";

export const arbeidsuforhetQueryKeys = {
  arbeidsuforhet: (personident: string) => ["arbeidsuforhet", personident],
};

export const useArbeidsuforhetVurderingQuery = () => {
  const personident = useValgtPersonident();
  const path = `${ISARBEIDSUFORHET_ROOT}/arbeidsuforhet/vurdering`;
  const fetchArbeidsuforhet = () =>
    get<ForhandsvarselRequestDTO[]>(path, personident); // TODO: Bruk riktig type når det er klart i backend

  const query = useQuery({
    queryKey: arbeidsuforhetQueryKeys.arbeidsuforhet(personident),
    queryFn: fetchArbeidsuforhet,
    enabled: !!personident,
  });

  return {
    ...query,
    data: query.data || [],
  };
};
