import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { SYFOPERSON_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import { minutesToMillis } from "@/utils/timeUtils";

const diskresjonskodeQueryKeys = {
  diskresjonskode: (fnr: string) => ["diskresjonskode", fnr],
};

export const useDiskresjonskodeQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${SYFOPERSON_ROOT}/person/diskresjonskode`;
  const fetchDiskresjonskode = () => get<number>(path, fnr);
  return useQuery({
    queryKey: diskresjonskodeQueryKeys.diskresjonskode(fnr),
    queryFn: fetchDiskresjonskode,
    enabled: !!fnr,
    staleTime: minutesToMillis(60 * 12),
    select: (diskresjonskode) => diskresjonskode.toString(),
  });
};
