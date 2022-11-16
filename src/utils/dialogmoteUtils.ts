import {
  DialogmoteDTO,
  DialogmoteStatus,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";

export const isAktivtDialogmote = (dialogmote: DialogmoteDTO): boolean => {
  return (
    dialogmote.status === DialogmoteStatus.INNKALT ||
    dialogmote.status === DialogmoteStatus.NYTT_TID_STED
  );
};

export const harMottattSvar = (dialogmote: DialogmoteDTO): boolean => {
  const svarFraArbeidstaker =
    dialogmote.arbeidstaker.varselList[0]?.svar?.svarType;
  const svarFraArbeidsgiver =
    dialogmote.arbeidsgiver.varselList[0]?.svar?.svarType;
  const svarFraBehandler =
    dialogmote.behandler?.varselList[0]?.svar[0]?.svarType;

  return (
    erSvarSomKreverHandling(svarFraArbeidstaker) ||
    erSvarSomKreverHandling(svarFraArbeidsgiver) ||
    erSvarSomKreverHandling(svarFraBehandler)
  );
};

const erSvarSomKreverHandling = (svartype: SvarType | undefined): boolean => {
  return (
    svartype === SvarType.NYTT_TID_STED || svartype === SvarType.KOMMER_IKKE
  );
};
