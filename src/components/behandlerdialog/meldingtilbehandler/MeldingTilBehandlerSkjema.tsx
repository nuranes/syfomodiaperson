import React, { useState } from "react";
import { SkjemaFeiloppsummering } from "@/components/SkjemaFeiloppsummering";
import { FlexRow } from "@/components/Layout";
import { Button } from "@navikt/ds-react";
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
import { MeldingTilBehandlerDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { useMeldingTilBehandler } from "@/data/behandlerdialog/useMeldingTilBehandler";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import { tilDatoMedManedNavn, visKlokkeslett } from "@/utils/datoUtils";
import { FormApi } from "final-form";

const texts = {
  knappTekst: "Send til behandler",
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

interface MeldingTilBehandlerSkjemaValues
  extends MeldingTilBehandlerSkjemaFritekstfelter {
  behandlerRef: string;
}

interface MeldingTilBehandlerSkjemaFritekstfelter {
  [meldingTekstField]: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 2000; // TODO: må bli enige om noe her

export const MeldingTilBehandlerSkjema = () => {
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
      behandlerRef: values.behandlerRef,
      tekst: values[meldingTekstField],
    };
    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => form.reset(), // TODO: Reset for radiogruppe fungerer ikke
    });
  };

  return (
    <MeldingTilBehandlerFormWrapper>
      <Form onSubmit={submit} validate={validate}>
        {({ handleSubmit, submitFailed, errors }) => (
          <StyledForm onSubmit={handleSubmit}>
            {meldingTilBehandler.isSuccess && (
              <AlertstripeFullbredde type={"suksess"}>
                {`Meldingen ble sendt ${tilDatoMedManedNavn(
                  now
                )} kl ${visKlokkeslett(now)}`}
              </AlertstripeFullbredde>
            )}
            <VelgBehandler
              selectedBehandler={selectedBehandler}
              setSelectedBehandler={
                setSelectedBehandler
              } /* TODO: Skrive oss bort fra state her, bruke values fra form i stedet*/
            />
            <MeldingTekstfelt />
            {meldingTilBehandler.isError && (
              <SkjemaInnsendingFeil
                error={meldingTilBehandler.error}
                bottomPadding={null}
              />
            )}
            {submitFailed && harIkkeUtbedretFeil && (
              <SkjemaFeiloppsummering errors={errors} />
            )}
            <FlexRow>
              <Button
                variant={"primary"}
                onClick={resetFeilUtbedret}
                loading={meldingTilBehandler.isLoading}
                type={"submit"}
              >
                {texts.knappTekst}
              </Button>
            </FlexRow>
          </StyledForm>
        )}
      </Form>
    </MeldingTilBehandlerFormWrapper>
  );
};
