import React, { ReactElement, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { Form } from "react-final-form";
import {
  AvlysDialogmoteDTO,
  DialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { SkjemaFeiloppsummering } from "../../../../components/SkjemaFeiloppsummering";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { validerBegrunnelser } from "@/utils/valideringUtils";
import { useAvlysningDocument } from "@/hooks/dialogmote/document/useAvlysningDocument";
import { ForhandsvisningModal } from "../../../../components/ForhandsvisningModal";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useAvlysDialogmote } from "@/data/dialogmote/useAvlysDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import FritekstSeksjon from "@/components/dialogmote/FritekstSeksjon";
import { Alert, Box, Button, Label } from "@navikt/ds-react";
import { tilDatoMedUkedagOgManedNavnOgKlokkeslett } from "@/utils/datoUtils";

export const MAX_LENGTH_AVLYS_BEGRUNNELSE = 500;

export const texts = {
  begrunnelseArbeidstakerLabel: "Begrunnelse til arbeidstakeren",
  begrunnelseArbeidsgiverLabel: "Begrunnelse til nærmeste leder",
  begrunnelseBehandlerLabel: "Begrunnelse til behandler",
  send: "Send",
  avbryt: "Avbryt",
  alert:
    "Hvis årsaken til avlysning er at arbeidstakeren ikke møtte opp, bør du vurdere om sykepengene skal stanses.",
  forhandsvisningSubtitle: "Avlysning av dialogmøte",
  forhandsvisningArbeidstakerTitle: "Brev til arbeidstakeren",
  forhandsvisningArbeidsgiverTitle: "Brev til nærmeste leder",
  forhandsvisningBehandlerTitle: "Brev til behandler",
  forhandsvisningArbeidstakerContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidstaker",
  forhandsvisningArbeidsgiverContentlabel:
    "Forhåndsvis avlysning av dialogmøte arbeidsgiver",
  forhandsvisningBehandlerContentlabel:
    "Forhåndsvis avlysning av dialogmøte behandler",
  gjelderTitle: "Gjelder dialogmøtet",
};

interface AvlysDialogmoteSkjemaProps {
  dialogmote: DialogmoteDTO;
  pageTitle: string;
}

export interface AvlysDialogmoteSkjemaValues {
  begrunnelseArbeidstaker: string;
  begrunnelseArbeidsgiver: string;
  begrunnelseBehandler?: string;
}

const AvlysDialogmoteSkjema = ({
  dialogmote,
}: AvlysDialogmoteSkjemaProps): ReactElement => {
  const fnr = useValgtPersonident();
  const avlysDialogmote = useAvlysDialogmote(fnr, dialogmote.uuid);
  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();
  const [
    displayAvlysningArbeidstakerPreview,
    setDisplayAvlysningArbeidstakerPreview,
  ] = useState(false);
  const [
    displayAvlysningArbeidsgiverPreview,
    setDisplayAvlysningArbeidsgiverPreview,
  ] = useState(false);
  const [
    displayAvlysningBehandlerPreview,
    setDisplayAvlysningBehandlerPreview,
  ] = useState(false);
  const {
    getAvlysningDocumentArbeidstaker,
    getAvlysningDocumentArbeidsgiver,
    getAvlysningDocumentBehandler,
  } = useAvlysningDocument(dialogmote);

  const validate = (
    values: Partial<AvlysDialogmoteSkjemaValues>
  ): Partial<AvlysDialogmoteSkjemaValues> => {
    const begrunnelserFeil = validerBegrunnelser(
      values,
      MAX_LENGTH_AVLYS_BEGRUNNELSE,
      !!dialogmote.behandler
    );
    updateFeilUtbedret(begrunnelserFeil);

    return begrunnelserFeil;
  };

  const submit = (values: AvlysDialogmoteSkjemaValues) => {
    const avlysDto: AvlysDialogmoteDTO = {
      arbeidstaker: {
        begrunnelse: values.begrunnelseArbeidstaker,
        avlysning: getAvlysningDocumentArbeidstaker(values),
      },
      arbeidsgiver: {
        begrunnelse: values.begrunnelseArbeidsgiver,
        avlysning: getAvlysningDocumentArbeidsgiver(values),
      },
    };

    if (dialogmote.behandler) {
      avlysDto.behandler = {
        begrunnelse: values.begrunnelseBehandler || "",
        avlysning: getAvlysningDocumentBehandler(values),
      };
    }

    avlysDialogmote.mutate(avlysDto);
  };

  if (avlysDialogmote.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  return (
    <Box background="surface-default" padding="6">
      <Form initialValues={{}} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="mb-8 flex flex-col">
              <Label size="small">{texts.gjelderTitle}</Label>
              {tilDatoMedUkedagOgManedNavnOgKlokkeslett(dialogmote.tid)}
            </div>
            <FritekstSeksjon
              fieldName="begrunnelseArbeidstaker"
              label={texts.begrunnelseArbeidstakerLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidstakerPreview(true)
              }
              maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
            />
            <ForhandsvisningModal
              title={texts.forhandsvisningArbeidstakerTitle}
              contentLabel={texts.forhandsvisningArbeidstakerContentlabel}
              isOpen={displayAvlysningArbeidstakerPreview}
              handleClose={() => setDisplayAvlysningArbeidstakerPreview(false)}
              getDocumentComponents={() =>
                getAvlysningDocumentArbeidstaker(values)
              }
            />
            <FritekstSeksjon
              fieldName="begrunnelseArbeidsgiver"
              label={texts.begrunnelseArbeidsgiverLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidsgiverPreview(true)
              }
              maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
            />
            <ForhandsvisningModal
              title={texts.forhandsvisningArbeidsgiverTitle}
              contentLabel={texts.forhandsvisningArbeidsgiverContentlabel}
              isOpen={displayAvlysningArbeidsgiverPreview}
              handleClose={() => setDisplayAvlysningArbeidsgiverPreview(false)}
              getDocumentComponents={() =>
                getAvlysningDocumentArbeidsgiver(values)
              }
            />
            {dialogmote.behandler && (
              <>
                <FritekstSeksjon
                  fieldName="begrunnelseBehandler"
                  label={texts.begrunnelseBehandlerLabel}
                  handlePreviewClick={() =>
                    setDisplayAvlysningBehandlerPreview(true)
                  }
                  maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
                />
                <ForhandsvisningModal
                  title={texts.forhandsvisningBehandlerTitle}
                  contentLabel={texts.forhandsvisningBehandlerContentlabel}
                  isOpen={displayAvlysningBehandlerPreview}
                  handleClose={() => setDisplayAvlysningBehandlerPreview(false)}
                  getDocumentComponents={() =>
                    getAvlysningDocumentBehandler(values)
                  }
                />
              </>
            )}
            {avlysDialogmote.isError && (
              <SkjemaInnsendingFeil error={avlysDialogmote.error} />
            )}
            <Alert
              variant="warning"
              size="small"
              className="mb-8 [&>*]:max-w-fit"
            >
              {texts.alert}
            </Alert>
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <div className="flex gap-4">
              <Button
                type="submit"
                variant="primary"
                loading={avlysDialogmote.isPending}
                onClick={resetFeilUtbedret}
              >
                {texts.send}
              </Button>
              <Button
                as={Link}
                type="button"
                variant="tertiary"
                to={moteoversiktRoutePath}
              >
                {texts.avbryt}
              </Button>
            </div>
          </form>
        )}
      </Form>
    </Box>
  );
};

export default AvlysDialogmoteSkjema;
