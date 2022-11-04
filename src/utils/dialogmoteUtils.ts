import {
  DialogmoteDTO,
  DialogmoteStatus,
} from "@/data/dialogmote/types/dialogmoteTypes";

export const isAktivtDialogMote = (dialogmote: DialogmoteDTO): boolean => {
  return (
    dialogmote.status === DialogmoteStatus.INNKALT ||
    dialogmote.status === DialogmoteStatus.NYTT_TID_STED
  );
};
