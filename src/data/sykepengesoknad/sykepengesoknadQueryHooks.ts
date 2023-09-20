import { SYKEPENGESOKNAD_BACKEND_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";
import {
  SporsmalDTO,
  SvarTypeDTO,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

export const sykepengesoknaderQueryKeys = {
  sykepengesoknader: (fnr: string) => ["sykepengesoknader", fnr],
};

export const useSykepengesoknaderQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYKEPENGESOKNAD_BACKEND_ROOT}/veileder/soknader`;
  const fetchSykepengesoknader = () => get<SykepengesoknadDTO[]>(path, fnr);
  const query = useQuery({
    queryKey: sykepengesoknaderQueryKeys.sykepengesoknader(fnr),
    queryFn: fetchSykepengesoknader,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
    select: (data) => data.map(parseSoknad),
  });

  return {
    ...query,
    data: query.data || [],
  };
};

export const parseSoknad = (soknad: SykepengesoknadDTO): SykepengesoknadDTO => {
  return {
    ...soknad,
    fom: new Date(soknad.fom),
    tom: new Date(soknad.tom),
    opprettetDato: new Date(soknad.opprettetDato),
    sendtTilNAVDato: soknad.sendtTilNAVDato
      ? new Date(soknad.sendtTilNAVDato)
      : undefined,
    sendtTilArbeidsgiverDato: soknad.sendtTilArbeidsgiverDato
      ? new Date(soknad.sendtTilArbeidsgiverDato)
      : undefined,
    sporsmal: [...soknad.sporsmal].map(parseSporsmal),
  };
};

const parseSporsmal = (sporsmal: SporsmalDTO): any => {
  const minMax = getMinMax(sporsmal);
  return {
    ...sporsmal,
    ...minMax,
    undersporsmal: [...sporsmal.undersporsmal].map(parseSporsmal),
  };
};

const getMinMax = (sporsmal: SporsmalDTO) => {
  switch (sporsmal.svartype) {
    case SvarTypeDTO.PERIODER:
    case SvarTypeDTO.DATO: {
      return {
        min: sporsmal.min ? new Date(sporsmal.min) : sporsmal.min,
        max: sporsmal.max ? new Date(sporsmal.max) : sporsmal.max,
      };
    }
    case SvarTypeDTO.TALL:
    case SvarTypeDTO.TIMER:
    case SvarTypeDTO.PROSENT: {
      return {
        min: parseInt(sporsmal.min, 10),
        max: parseInt(sporsmal.max, 10),
      };
    }
    default: {
      return {};
    }
  }
};
