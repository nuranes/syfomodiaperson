import { SYFOVEILEDER_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { VeilederinfoDTO } from "@/data/veilederinfo/types/VeilederinfoDTO";
import { useQuery } from "react-query";

export const veilederinfoQueryKeys = {
  veilederinfo: ["veilederinfo"],
  veilederinfoByIdent: (ident: string) => [
    ...veilederinfoQueryKeys.veilederinfo,
    ident,
  ],
};

export const useAktivVeilederinfoQuery = () => {
  const path = `${SYFOVEILEDER_ROOT}/veileder/self`;
  const fetchVeilederinfo = () => get<VeilederinfoDTO>(path);
  return useQuery(veilederinfoQueryKeys.veilederinfo, fetchVeilederinfo);
};

export const useVeilederInfoQuery = (ident: string) => {
  const fetchVeilederinfoByIdent = () =>
    get<VeilederinfoDTO>(`${SYFOVEILEDER_ROOT}/veileder/${ident}`);
  return useQuery(
    veilederinfoQueryKeys.veilederinfoByIdent(ident),
    fetchVeilederinfoByIdent,
    { enabled: !!ident }
  );
};
