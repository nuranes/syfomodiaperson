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

export const isPersonoppgaveCompletedAfterLastMoteEndring = (
  oppgave: PersonOppgave,
  dialogmote: DialogmoteDTO
) => {
  const behandletTidspunkt = dayjs(oppgave.behandletTidspunkt);
  const lastMoteEndring = dayjs(
    dialogmote.arbeidstaker.varselList[0]?.createdAt || null
  );

  return behandletTidspunkt.isAfter(lastMoteEndring);
};
