import {
  useBehandlerByBehandlerRefQuery,
  useBehandlereQuery,
} from "@/data/behandler/behandlereQueryHooks";
import { behandlerNavn } from "@/utils/behandlerUtils";

export const useBehandlerNavn = (behandlerRef: string): string => {
  const { data: behandlere } = useBehandlereQuery();
  const behandlerFromBehandlerList = behandlere.find(
    (behandler) => behandler.behandlerRef === behandlerRef
  );
  const { data: behandler } = useBehandlerByBehandlerRefQuery(
    behandlerRef,
    !behandlerFromBehandlerList
  );

  if (behandlerFromBehandlerList) {
    return behandlerNavn(behandlerFromBehandlerList);
  } else {
    return !!behandler ? behandlerNavn(behandler) : "";
  }
};
