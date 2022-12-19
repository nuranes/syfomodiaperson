import React, { useState } from "react";
import { useFormState } from "react-final-form";
import { Forhandsvisning } from "../Forhandsvisning";
import { EndreTidStedSkjemaValues } from "./EndreDialogmoteSkjema";
import { useTidStedDocument } from "@/hooks/dialogmote/document/useTidStedDocument";
import FritekstSeksjon from "@/components/dialogmote/FritekstSeksjon";
import { DialogmoteDTO } from "@/data/dialogmote/types/dialogmoteTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";

export const MAX_LENGTH_ENDRE_BEGRUNNELSE = 2000;

export const texts = {
  send: "Lagre endringer",
  avbryt: "Avbryt",
  begrunnelseArbeidsgiver: "Begrunnelse til nærmeste leder",
  begrunnelseArbeidstaker: "Begrunnelse til arbeidstakeren",
  begrunnelseBehandler: "Begrunnelse til behandler",
  forhandsvisningSubtitle: "Endret dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis endring av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis endring av dialogmøte behandler",
  noNarmesteleder:
    "Det er ikke registrert en nærmeste leder fra denne arbeidsgiveren, derfor sender vi dette brevet automatisk til " +
    "Altinn. Lederen må registrere seg som nærmeste leder i Altinn for å kunne gi svar på Nav.no.",
};

interface Props {
  dialogmote: DialogmoteDTO;
}

const EndreDialogmoteTekster = ({ dialogmote }: Props) => {
  const { behandler, arbeidsgiver } = dialogmote;
  const { currentLedere } = useLedereQuery();

  const virksomhetsnummer = arbeidsgiver.virksomhetsnummer;
  const narmesteLeder = narmesteLederForVirksomhet(
    currentLedere,
    virksomhetsnummer
  );
  const noNarmesteLeder = !narmesteLeder;

  const { values } = useFormState<EndreTidStedSkjemaValues>();
  const [
    displayEndringArbeidstakerPreview,
    setDisplayEndringArbeidstakerPreview,
  ] = useState(false);
  const [
    displayEndringArbeidsgiverPreview,
    setDisplayEndringArbeidsgiverPreview,
  ] = useState(false);
  const [displayEndringBehandlerPreview, setDisplayEndringBehandlerPreview] =
    useState(false);
  const {
    getTidStedDocumentArbeidstaker,
    getTidStedDocumentArbeidsgiver,
    getTidStedDocumentBehandler,
  } = useTidStedDocument(dialogmote);

  return (
    <>
      <FritekstSeksjon
        fieldName="begrunnelseArbeidstaker"
        label={texts.begrunnelseArbeidstaker}
        handlePreviewClick={() => setDisplayEndringArbeidstakerPreview(true)}
        maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
      />
      <Forhandsvisning
        title={texts.forhandsvisningArbeidstakerTitle}
        contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
        isOpen={displayEndringArbeidstakerPreview}
        handleClose={() => setDisplayEndringArbeidstakerPreview(false)}
        getDocumentComponents={() => getTidStedDocumentArbeidstaker(values)}
      />

      <FritekstSeksjon
        fieldName="begrunnelseArbeidsgiver"
        label={texts.begrunnelseArbeidsgiver}
        handlePreviewClick={() => setDisplayEndringArbeidsgiverPreview(true)}
        maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
        alertText={noNarmesteLeder ? texts.noNarmesteleder : undefined}
      />
      <Forhandsvisning
        title={texts.forhandsvisningArbeidsgiverTitle}
        contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
        isOpen={displayEndringArbeidsgiverPreview}
        handleClose={() => setDisplayEndringArbeidsgiverPreview(false)}
        getDocumentComponents={() => getTidStedDocumentArbeidsgiver(values)}
      />
      {behandler && (
        <>
          <FritekstSeksjon
            fieldName="begrunnelseBehandler"
            label={texts.begrunnelseBehandler}
            handlePreviewClick={() => setDisplayEndringBehandlerPreview(true)}
            maxLength={MAX_LENGTH_ENDRE_BEGRUNNELSE}
          />
          <Forhandsvisning
            title={texts.forhandsvisningBehandlerTitle}
            contentLabel={texts.forhandsvisningBehandlerContentLabel}
            isOpen={displayEndringBehandlerPreview}
            handleClose={() => setDisplayEndringBehandlerPreview(false)}
            getDocumentComponents={() => getTidStedDocumentBehandler(values)}
          />
        </>
      )}
    </>
  );
};

export default EndreDialogmoteTekster;
