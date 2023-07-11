import React from "react";
import { tilLesbarDatoMedArstall } from "../datoUtils";
import { formaterOrgnr } from "@/utils";
import {
  Soknadstatus,
  SykepengesoknadDTO,
} from "@/data/sykepengesoknad/types/SykepengesoknadDTO";
import { BodyShort } from "@navikt/ds-react";

const texts = {
  korrigert: "Korrigert",
};

interface SoknadStatustekstProps {
  soknad: SykepengesoknadDTO;
}

const SoknadStatustekst = ({ soknad }: SoknadStatustekstProps) => {
  const isSoknadSentToNav = !!soknad.sendtTilNAVDato;
  const isSoknadSentToArbeidsgiver = !!soknad.sendtTilArbeidsgiverDato;

  const arbeidsgiver = soknad.arbeidsgiver?.navn;
  const orgnr =
    soknad.arbeidsgiver?.orgnummer &&
    formaterOrgnr(soknad.arbeidsgiver.orgnummer);
  const sendtTilArbeidsgiverDato =
    soknad.sendtTilArbeidsgiverDato &&
    tilLesbarDatoMedArstall(soknad.sendtTilArbeidsgiverDato);
  const sendtTilNavDato =
    soknad.sendtTilNAVDato && tilLesbarDatoMedArstall(soknad.sendtTilNAVDato);

  if (soknad.status === Soknadstatus.KORRIGERT) {
    return <BodyShort size="small">{texts.korrigert}</BodyShort>;
  } else if (isSoknadSentToNav && isSoknadSentToArbeidsgiver) {
    return (
      <BodyShort size="small">
        Sendt til NAV og {arbeidsgiver} (org. nr. {orgnr}): {sendtTilNavDato}
      </BodyShort>
    );
  } else if (isSoknadSentToNav && !isSoknadSentToArbeidsgiver) {
    return <BodyShort size="small">Sendt til NAV: {sendtTilNavDato}</BodyShort>;
  } else {
    return (
      <BodyShort size="small">
        Sendt til {arbeidsgiver} (org. nr. {orgnr}): {sendtTilArbeidsgiverDato}
      </BodyShort>
    );
  }
};

export default SoknadStatustekst;
