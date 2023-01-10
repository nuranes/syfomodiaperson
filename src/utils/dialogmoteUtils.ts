import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import dayjs from "dayjs";

export const isAktivtDialogmote = (dialogmote: DialogmoteDTO): boolean => {
  return (
    dialogmote.status === DialogmoteStatus.INNKALT ||
    dialogmote.status === DialogmoteStatus.NYTT_TID_STED
  );
};

export const oppgaveCreatedAfterLatestMoteEndring = (
  oppgave: PersonOppgave,
  dialogmote: DialogmoteDTO
) => {
  const oppgaveCreatedAt = dayjs(oppgave.opprettet);
  const dialogmoteUpdatedAt = dayjs(dialogmote.updatedAt);
  return oppgaveCreatedAt.isAfter(dialogmoteUpdatedAt);
};
