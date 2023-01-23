import { ISDIALOGMOTE_ROOT } from "@/apiConstants";
import { get } from "@/api/axios";
import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { useQuery } from "@tanstack/react-query";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useMemo } from "react";
import { isAktivtDialogmote } from "@/utils/dialogmoteUtils";

export const dialogmoterQueryKeys = {
  dialogmoter: (fnr: string) => ["dialogmoter", fnr],
};

export const useDialogmoterQuery = () => {
  const fnr = useValgtPersonident();
  const path = `${ISDIALOGMOTE_ROOT}/dialogmote/personident`;
  const fetchDialogmoter = () => get<DialogmoteDTO[]>(path, fnr);
  const query = useQuery(
    dialogmoterQueryKeys.dialogmoter(fnr),
    fetchDialogmoter,
    {
      enabled: !!fnr,
    }
  );

  return {
    ...query,
    data: query.data || [],
    aktivtDialogmote: useMemo(
      () => query.data?.find((mote) => isAktivtDialogmote(mote)),
      [query.data]
    ),
    ferdigstilteDialogmoter: useMemo(
      () =>
        query.data?.filter(
          (mote) => mote.status === DialogmoteStatus.FERDIGSTILT
        ) || [],
      [query.data]
    ),
    historiskeDialogmoter: useMemo(
      () =>
        query.data?.filter(
          (mote) =>
            mote.status === DialogmoteStatus.FERDIGSTILT ||
            mote.status === DialogmoteStatus.AVLYST
        ) || [],
      [query.data]
    ),
  };
};
