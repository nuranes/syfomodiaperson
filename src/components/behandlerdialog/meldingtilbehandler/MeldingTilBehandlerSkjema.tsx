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
  validerTekst,
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
import { SelectMeldingType } from "@/components/behandlerdialog/meldingtilbehandler/SelectMeldingType";
import { MeldingsTypeInfo } from "@/components/behandlerdialog/meldingtilbehandler/MeldingsTypeInfo";

const texts = {
  sendKnapp: "Send til behandler",
  previewKnapp: "Forhåndsvisning",
  previewContentLabel: "Forhåndsvis melding til behandler",
  validation: {
    // TODO: se nærmere på tekstene
    missingMeldingTekst: "Innholdet i meldingen er tomt",
    missingTypeTekst: "Vennligst velg type melding",
  },
};

const StyledForm = styled.form`
  > * {
    &:not(:last-child) {
      margin-bottom: 1.5em;
    }
  }
`;

const MeldingsType = styled.div`
  width: 23em;

  > * {
    &:not(:last-child) {
      margin-bottom: 1.5em;
    }
  }
`;

export interface MeldingTilBehandlerSkjemaValues
  extends MeldingTilBehandlerSkjemaFritekstfelter {
  behandlerRef: string;
  type: MeldingType;
}

interface MeldingTilBehandlerSkjemaFritekstfelter {
  [meldingTekstField]: string;
}

type MeldingTilBehandlerSkjemaFeil = {
  [K in keyof MeldingTilBehandlerSkjemaValues]: string | undefined;
};

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const { getMeldingTilBehandlerDocument } = useMeldingTilBehandlerDocument();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const { harIkkeUtbedretFeil, resetFeilUtbedret, updateFeilUtbedret } =
    useFeilUtbedret();
  const meldingTilBehandler = useMeldingTilBehandler();

  const now = new Date();

  const validate = (
    values: Partial<MeldingTilBehandlerSkjemaValues>
  ): MeldingTilBehandlerSkjemaFeil => {
    const meldingTilBehandlerSkjemaTekst = {
      maxLength: MAX_LENGTH_BEHANDLER_MELDING,
      value: values.meldingTekst || "",
      missingRequiredMessage: texts.validation.missingMeldingTekst,
    };
    const feilmeldinger: MeldingTilBehandlerSkjemaFeil = {
      type: values.type ? undefined : texts.validation.missingTypeTekst,
      behandlerRef: behandlerRefValidationErrors(values.behandlerRef, false),
      [meldingTekstField]: validerTekst(meldingTilBehandlerSkjemaTekst),
    };

    updateFeilUtbedret(feilmeldinger);
    return feilmeldinger;
  };

  const submit = (
    values: MeldingTilBehandlerSkjemaValues,
    form: FormApi<MeldingTilBehandlerSkjemaValues>
  ) => {
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.type,
      behandlerRef: values.behandlerRef,
      tekst: values[meldingTekstField],
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };
    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => form.reset(), // TODO: Reset for radiogruppe fungerer ikke
    });
  };

  const PreviewButton = () => {
    return (
      <Button
        variant="secondary"
        type="button"
        onClick={() => setDisplayPreview(true)}
      >
        {texts.previewKnapp}
      </Button>
    );
  };

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit, submitFailed, errors, values }) => (
        <StyledForm onSubmit={handleSubmit}>
          {meldingTilBehandler.isSuccess && (
            <Alert variant="success" size="small">
              {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
            </Alert>
          )}
          <MeldingsType>
            <SelectMeldingType />
            {values.type && <MeldingsTypeInfo meldingType={values.type} />}
          </MeldingsType>
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
            getDocumentComponents={() => getMeldingTilBehandlerDocument(values)}
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
            <PreviewButton />
          </ButtonRow>
        </StyledForm>
      )}
    </Form>
  );
};
