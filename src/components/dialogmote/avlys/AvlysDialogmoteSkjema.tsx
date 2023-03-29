import Panel from "nav-frontend-paneler";
import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { Link, Navigate } from "react-router-dom";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { FlexRow } from "../../Layout";
import { Form } from "react-final-form";
import DialogmoteInfo from "./DialogmoteInfo";
import {
  AvlysDialogmoteDTO,
  DialogmoteDTO,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { SkjemaFeiloppsummering } from "../../SkjemaFeiloppsummering";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import { validerBegrunnelser } from "@/utils/valideringUtils";
import { useAvlysningDocument } from "@/hooks/dialogmote/document/useAvlysningDocument";
import { Forhandsvisning } from "../../Forhandsvisning";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useAvlysDialogmote } from "@/data/dialogmote/useAvlysDialogmote";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import FritekstSeksjon from "@/components/dialogmote/FritekstSeksjon";
import { Flatknapp, Hovedknapp } from "nav-frontend-knapper";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

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

const AvlysPanel = styled(Panel)`
  padding: 1.75rem;
`;

const SendButton = styled(Hovedknapp)`
  margin-right: 0.5rem;
`;

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
    <AvlysPanel>
      <Form initialValues={{}} onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors, values }) => (
          <form onSubmit={handleSubmit}>
            <DialogmoteInfo dialogmote={dialogmote} />
            <FritekstSeksjon
              fieldName="begrunnelseArbeidstaker"
              label={texts.begrunnelseArbeidstakerLabel}
              handlePreviewClick={() =>
                setDisplayAvlysningArbeidstakerPreview(true)
              }
              maxLength={MAX_LENGTH_AVLYS_BEGRUNNELSE}
            />
            <Forhandsvisning
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
            <Forhandsvisning
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
                <Forhandsvisning
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
            <AlertstripeFullbredde type="advarsel" marginbottom="4em">
              {texts.alert}
            </AlertstripeFullbredde>
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <SendButton
                data-cy="sendAvlysningKnapp"
                onClick={resetFeilUtbedret}
                htmlType="submit"
                spinner={avlysDialogmote.isLoading}
                autoDisableVedSpinner
              >
                {texts.send}
              </SendButton>
              <Link to={moteoversiktRoutePath}>
                <Flatknapp htmlType="button">{texts.avbryt}</Flatknapp>
              </Link>
            </FlexRow>
          </form>
        )}
      </Form>
    </AvlysPanel>
  );
};

export default AvlysDialogmoteSkjema;
