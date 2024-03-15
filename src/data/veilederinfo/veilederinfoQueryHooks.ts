import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { Veileder } from "@/data/veilederinfo/types/Veileder";
import { useQuery } from "@tanstack/react-query";

export const veilederinfoQueryKeys = {
  veilederinfo: ["veilederinfo"],
  veilederinfoByIdent: (ident: string) => [
    ...veilederinfoQueryKeys.veilederinfo,
    ident,
  ],
};

export const useAktivVeilederinfoQuery = () => {
  const path = `${SYFOVEILEDER_ROOT}/veiledere/self`;
  const fetchVeilederinfo = () => get<Veileder>(path);
  return useQuery({
    queryKey: veilederinfoQueryKeys.veilederinfo,
    queryFn: fetchVeilederinfo,
    select: (data) =>
      new Veileder(
        data.ident,
        data.fornavn,
        data.etternavn,
        data.epost,
        data.telefonnummer
      ),
  });
};

export const useVeilederInfoQuery = (ident: string) => {
  const fetchVeilederinfoByIdent = () =>
    get<Veileder>(`${SYFOVEILEDER_ROOT}/veiledere/${ident}`);
  return useQuery({
    queryKey: veilederinfoQueryKeys.veilederinfoByIdent(ident),
    queryFn: fetchVeilederinfoByIdent,
    enabled: !!ident,
    select: (data) =>
      new Veileder(
        data.ident,
        data.fornavn,
        data.etternavn,
        data.epost,
        data.telefonnummer
      ),
  });
};
