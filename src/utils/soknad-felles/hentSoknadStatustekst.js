import { tilLesbarDatoMedArstall } from "../datoUtils";
import { formaterOrgnr } from "../index";
import { SoknadstatusDTO } from "@/data/sykepengesoknad/types/SykepengesoknadDTO";

const texts = {
  korrigert: "Korrigert",
};

const textSendtTilArbeidsgiverOgNav = (
  arbeidsgiver,
  orgnr,
  sendtTilNavDato
) => {
  return `Sendt til NAV og ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilNavDato}`;
};

const textSendtTilNav = (sendtTilNavDato) => {
  return `Sendt til NAV: ${sendtTilNavDato}`;
};

const textSendtTilArbeidsgiver = (
  arbeidsgiver,
  orgnr,
  sendtTilArbeidsgiverDato
) => {
  return `Sendt til ${arbeidsgiver} (org. nr. ${orgnr}): ${sendtTilArbeidsgiverDato}`;
};

const hentStatustekst = (soknad) => {
  const isSoknadSentToNav = !!soknad.sendtTilNAVDato || !!soknad.innsendtDato;
  const isSoknadSentToArbeidsgiver = !!soknad.sendtTilArbeidsgiverDato;

  const arbeidsgiver =
    soknad.arbeidsgiver && soknad.arbeidsgiver.navn
      ? soknad.arbeidsgiver.navn
      : soknad.arbeidsgiver
      ? soknad.arbeidsgiver
      : null;
  const orgnr =
    soknad.arbeidsgiver && soknad.arbeidsgiver.orgnummer
      ? formaterOrgnr(soknad.arbeidsgiver.orgnummer)
      : null;
  const sendtTilArbeidsgiverDato = isSoknadSentToArbeidsgiver
    ? tilLesbarDatoMedArstall(soknad.sendtTilArbeidsgiverDato)
    : null;
  const sendtTilNavDato = isSoknadSentToNav
    ? tilLesbarDatoMedArstall(soknad.sendtTilNAVDato || soknad.innsendtDato)
    : null;

  return soknad.status === SoknadstatusDTO.KORRIGERT
    ? texts.korrigert
    : isSoknadSentToNav && isSoknadSentToArbeidsgiver
    ? textSendtTilArbeidsgiverOgNav(arbeidsgiver, orgnr, sendtTilNavDato)
    : isSoknadSentToNav && !isSoknadSentToArbeidsgiver
    ? textSendtTilNav(sendtTilNavDato)
    : textSendtTilArbeidsgiver(arbeidsgiver, orgnr, sendtTilArbeidsgiverDato);
};

export default hentStatustekst;
