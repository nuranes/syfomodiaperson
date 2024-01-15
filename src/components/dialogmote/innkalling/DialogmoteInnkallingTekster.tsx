import React, { ReactElement, useState } from "react";
import { useFormState } from "react-final-form";
import DialogmoteInnkallingSkjemaSeksjon from "./DialogmoteInnkallingSkjemaSeksjon";
import { DialogmoteInnkallingSkjemaValues } from "./DialogmoteInnkallingSkjema";
import { useInnkallingDocument } from "@/hooks/dialogmote/document/useInnkallingDocument";
import { ForhandsvisningModal } from "../../ForhandsvisningModal";
import FritekstSeksjon from "../FritekstSeksjon";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { Alert } from "@navikt/ds-react";

export const MAX_LENGTH_INNKALLING_FRITEKST = 2000;

export const texts = {
  title: "Tekster i innkallingen",
  arbeidstakerLabel: "Fritekst til arbeidstakeren (valgfri)",
  arbeidsgiverLabel: "Fritekst til nærmeste leder (valgfri)",
  behandlerLabel: "Fritekst til behandler (valgfri)",
  forhandsvisningSubtitle: "Innkalling til dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidstakerContentLabel:
    "Forhåndsvis innkalling til dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningArbeidsgiverContentLabel:
    "Forhåndsvis innkalling til dialogmøte arbeidsgiver",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningBehandlerContentLabel:
    "Forhåndsvis innkalling til dialogmøte behandler",
  reservertAlert:
    "Denne arbeidstakeren vil få brevet sendt som papirpost. Du kan inkludere telefonnummeret til kontaktsenteret i fritekstfeltet (55 55 33 33), slik at arbeidstakeren kan ta kontakt på telefon hvis tidspunktet ikke passer.",
};

interface DialogmoteInnkallingTeksterProps {
  selectedBehandler: BehandlerDTO | undefined;
}

const DialogmoteInnkallingTekster = ({
  selectedBehandler,
}: DialogmoteInnkallingTeksterProps): ReactElement => {
  const { brukerKanIkkeVarslesDigitalt } = useBrukerinfoQuery();
  const { values } = useFormState<DialogmoteInnkallingSkjemaValues>();
  const [
    displayInnkallingArbeidstakerPreview,
    setDisplayInnkallingArbeidstakerPreview,
  ] = useState(false);
  const [
    displayInnkallingArbeidsgiverPreview,
    setDisplayInnkallingArbeidsgiverPreview,
  ] = useState(false);

  const [
    displayInnkallingBehandlerPreview,
    setDisplayInnkallingBehandlerPreview,
  ] = useState(false);

  const {
    getInnkallingDocumentArbeidstaker,
    getInnkallingDocumentArbeidsgiver,
    getInnkallingDocumentBehandler,
  } = useInnkallingDocument();

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      {brukerKanIkkeVarslesDigitalt && (
        <Alert variant="warning" size="small" className="mb-4 [&>*]:max-w-fit">
          {texts.reservertAlert}
        </Alert>
      )}
      <FritekstSeksjon
        fieldName="fritekstArbeidstaker"
        label={texts.arbeidstakerLabel}
        handlePreviewClick={() => setDisplayInnkallingArbeidstakerPreview(true)}
        maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
      />
      <ForhandsvisningModal
        title={texts.forhandsvisningArbeidstakerTitle}
        contentLabel={texts.forhandsvisningArbeidstakerContentLabel}
        isOpen={displayInnkallingArbeidstakerPreview}
        handleClose={() => setDisplayInnkallingArbeidstakerPreview(false)}
        getDocumentComponents={() =>
          getInnkallingDocumentArbeidstaker(values, selectedBehandler)
        }
      />
      <FritekstSeksjon
        fieldName="fritekstArbeidsgiver"
        label={texts.arbeidsgiverLabel}
        handlePreviewClick={() => setDisplayInnkallingArbeidsgiverPreview(true)}
        maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
      />
      <ForhandsvisningModal
        title={texts.forhandsvisningArbeidsgiverTitle}
        contentLabel={texts.forhandsvisningArbeidsgiverContentLabel}
        isOpen={displayInnkallingArbeidsgiverPreview}
        handleClose={() => setDisplayInnkallingArbeidsgiverPreview(false)}
        getDocumentComponents={() =>
          getInnkallingDocumentArbeidsgiver(values, selectedBehandler)
        }
      />

      {!!selectedBehandler && (
        <>
          <FritekstSeksjon
            fieldName="fritekstBehandler"
            label={texts.behandlerLabel}
            handlePreviewClick={() =>
              setDisplayInnkallingBehandlerPreview(true)
            }
            maxLength={MAX_LENGTH_INNKALLING_FRITEKST}
          />
          <ForhandsvisningModal
            title={texts.forhandsvisningBehandlerTitle}
            contentLabel={texts.forhandsvisningBehandlerContentLabel}
            isOpen={displayInnkallingBehandlerPreview}
            handleClose={() => setDisplayInnkallingBehandlerPreview(false)}
            getDocumentComponents={() => getInnkallingDocumentBehandler(values)}
          />
        </>
      )}
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};

export default DialogmoteInnkallingTekster;
