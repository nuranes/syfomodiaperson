import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
  SvarType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import dayjs from "dayjs";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

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

export const getSvarTekst = (
  svarTidspunkt: string,
  svarType: SvarType,
  antallSvar = 1
) => {
  const mottattPrefiks =
    antallSvar > 1 ? "Oppdatering mottatt" : "Svar mottatt";
  const mottattTekst = `${mottattPrefiks} ${tilLesbarDatoMedArUtenManedNavn(
    svarTidspunkt
  )}`;
  switch (svarType) {
    case SvarType.KOMMER:
      return `kommer - ${mottattTekst}`;
    case SvarType.NYTT_TID_STED:
      return `ønsker å endre tidspunkt eller sted - ${mottattTekst}`;
    case SvarType.KOMMER_IKKE:
      return `ønsker å avlyse - ${mottattTekst}`;
  }
};

export const getHarAapnetTekst = (
  varselType: MotedeltakerVarselType | undefined,
  lestDato: string | undefined
): string => {
  const lestDatoString = tilLesbarDatoMedArUtenManedNavn(lestDato);
  switch (varselType) {
    case MotedeltakerVarselType.INNKALT:
      return lestDato
        ? `åpnet innkallingen ${lestDatoString} - Har ikke gitt svar`
        : "har ikke åpnet innkallingen";
    case MotedeltakerVarselType.NYTT_TID_STED:
      return lestDato
        ? `åpnet endringen ${lestDatoString} - Har ikke gitt svar`
        : "har ikke åpnet endringen";
    default:
      return "";
  }
};
