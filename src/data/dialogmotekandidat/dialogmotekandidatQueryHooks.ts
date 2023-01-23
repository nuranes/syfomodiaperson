import { useQuery } from "@tanstack/react-query";
import { get } from "@/api/axios";
import { ISDIALOGMOTEKANDIDAT_ROOT } from "@/apiConstants";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { DialogmotekandidatDTO } from "@/data/dialogmotekandidat/dialogmotekandidatTypes";
import { useLatestFerdigstiltReferat } from "@/hooks/dialogmote/useDialogmoteReferat";

export const dialogmotekandidatQueryKeys = {
  kandidat: (personident: string) => ["dialogmotekandidat", personident],
  unntaksstatistikk: () => ["unntaksstatistikk"],
};

export const useIsDialogmoteKandidatWithoutFerdigstiltReferat = (
  kandidat?: boolean,
  kandidatAt?: string
): boolean => {
  const latestFerdigstiltReferat = useLatestFerdigstiltReferat();
  if (!kandidatAt || !kandidat) {
    return false;
  }
  if (!latestFerdigstiltReferat) {
    return true;
  }
  return (
    new Date(kandidatAt)?.getTime() >
    new Date(latestFerdigstiltReferat.createdAt).getTime()
  );
};

export const useDialogmotekandidat = () => {
  const personident = useValgtPersonident();
  const path = `${ISDIALOGMOTEKANDIDAT_ROOT}/kandidat/personident`;
  const fetchKandidat = () => get<DialogmotekandidatDTO>(path, personident);
  const query = useQuery(
    dialogmotekandidatQueryKeys.kandidat(personident),
    fetchKandidat,
    {
      enabled: !!personident,
    }
  );

  const isNoFerdigstiltDialogmoteReferatAfterKandidatAt =
    useIsDialogmoteKandidatWithoutFerdigstiltReferat(
      query.data?.kandidat,
      query.data?.kandidatAt
    );

  const isKandidat: boolean =
    isNoFerdigstiltDialogmoteReferatAfterKandidatAt || false;

  return {
    ...query,
    isKandidat,
  };
};
