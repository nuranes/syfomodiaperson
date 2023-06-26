import React, { useState } from "react";
import { SkjemaFeiloppsummering } from "@/components/SkjemaFeiloppsummering";
import { ButtonRow } from "@/components/Layout";
import { Alert, Button } from "@navikt/ds-react";
import { Form } from "react-final-form";
import { VelgBehandler } from "@/components/behandlerdialog/meldingtilbehandler/VelgBehandler";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import styled from "styled-components";
import {
  MeldingTekstfelt,
  meldingTekstField,
} from "@/components/behandlerdialog/meldingtilbehandler/MeldingTekstfelt";
import {
  behandlerRefValidationErrors,
  validerSkjemaTekster,
} from "@/utils/valideringUtils";
import { useFeilUtbedret } from "@/hooks/useFeilUtbedret";
import {
  MeldingTilBehandlerDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { useMeldingTilBehandler } from "@/data/behandlerdialog/useMeldingTilBehandler";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { FormApi } from "final-form";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { behandlerNavn } from "@/utils/behandlerUtils";

const texts = {
  sendKnapp: "Send til behandler",
  previewKnapp: "Forhåndsvisning",
  previewContentLabel: "Forhåndsvis melding til behandler",
  validation: {
    missingMeldingTekst: "Innholdet i meldingen er tomt", // TODO: se nærmere på teksten
  },
};

const MeldingTilBehandlerFormWrapper = styled.div`
  margin-top: 1.5em;
`;

const StyledForm = styled.form`
  > * {
    &:not(:last-child) {
      margin-bottom: 1.5em;
    }
  }
`;

export interface MeldingTilBehandlerSkjemaValues
  extends MeldingTilBehandlerSkjemaFritekstfelter {
  behandlerRef: string;
}

interface MeldingTilBehandlerSkjemaFritekstfelter {
  [meldingTekstField]: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 2000; // TODO: må bli enige om noe her

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const { getTilleggsOpplysningerPasientDocument } =
    useMeldingTilBehandlerDocument();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();
  const meldingTilBehandler = useMeldingTilBehandler();
  const now = new Date();

  const validate = (
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): Partial<MeldingTilBehandlerSkjemaValues> => {
    const friteksterFeil =
      validerSkjemaTekster<MeldingTilBehandlerSkjemaFritekstfelter>({
        meldingTekst: {
          maxLength: MAX_LENGTH_BEHANDLER_MELDING,
          value: values.meldingTekst || "",
          missingRequiredMessage: texts.validation.missingMeldingTekst,
        },
      });
    const feilmeldinger: Partial<MeldingTilBehandlerSkjemaValues> = {
      behandlerRef: behandlerRefValidationErrors(values.behandlerRef, false),
      ...friteksterFeil,
    };

    updateFeilUtbedret(feilmeldinger);
    return feilmeldinger;
  };

  const submit = (
    values: MeldingTilBehandlerSkjemaValues,
    form: FormApi<MeldingTilBehandlerSkjemaValues>
  ) => {
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER,
      behandlerRef: values.behandlerRef,
      tekst: values[meldingTekstField],
      document: getTilleggsOpplysningerPasientDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };
    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => form.reset(), // TODO: Reset for radiogruppe fungerer ikke
    });
  };

  return (
    <MeldingTilBehandlerFormWrapper>
      <Form onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors, values }) => (
          <StyledForm onSubmit={handleSubmit}>
            {meldingTilBehandler.isSuccess && (
              <Alert variant="success" size="small">
                {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
              </Alert>
            )}
            <VelgBehandler
              selectedBehandler={selectedBehandler}
              setSelectedBehandler={
                setSelectedBehandler
              } /* TODO: Skrive oss bort fra state her, bruke values fra form i stedet*/
            />
            <MeldingTekstfelt />
            <Forhandsvisning
              contentLabel={texts.previewContentLabel}
              isOpen={displayPreview}
              handleClose={() => setDisplayPreview(false)}
              getDocumentComponents={() =>
                getTilleggsOpplysningerPasientDocument(values)
              }
            />
            {meldingTilBehandler.isError && (
              <SkjemaInnsendingFeil
                error={meldingTilBehandler.error}
                bottomPadding={null}
              />
            )}
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <ButtonRow>
              <Button
                variant="primary"
                onClick={resetFeilUtbedret}
                loading={meldingTilBehandler.isLoading}
                type="submit"
              >
                {texts.sendKnapp}
              </Button>
              <Button
                variant="secondary"
                type="button"
                onClick={() => setDisplayPreview(true)}
              >
                {texts.previewKnapp}
              </Button>
            </ButtonRow>
          </StyledForm>
        )}
      </Form>
    </MeldingTilBehandlerFormWrapper>
  );
};
