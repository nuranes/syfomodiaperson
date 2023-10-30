import React, { useState } from "react";
import { Alert, Button, Select, Textarea } from "@navikt/ds-react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import styled from "styled-components";
import { meldingTekstField } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTekstfelt";
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
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { useMeldingTilBehandlerDocument } from "@/hooks/behandlerdialog/document/useMeldingTilBehandlerDocument";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { MeldingsTypeInfo } from "@/components/behandlerdialog/meldingtilbehandler/MeldingsTypeInfo";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { useForm } from "react-hook-form";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { VelgBehandler } from "@/components/behandlerdialog/meldingtilbehandler/VelgBehandler";
import { ButtonRow } from "@/components/Layout";

const texts = {
  sendKnapp: "Send til behandler",
  previewKnapp: "Forhåndsvisning",
  previewContentLabel: "Forhåndsvis melding til behandler",
  meldingsType: {
    label: "Hvilken meldingstype ønsker du å sende?",
    defaultOption: "Velg meldingstype",
    missing: "Vennligst velg type melding",
  },
  meldingsTekstLabel: "Skriv inn meldingstekst",
  meldingsTekstErrorMessage: "Vennligst angi meldingstekst",
};

const MeldingsType = styled.div`
  width: 23em;

  > * {
    &:not(:last-child) {
      margin-bottom: 1.5em;
    }
  }
`;

export interface MeldingTilBehandlerSkjemaValues {
  behandlerRef: string;
  meldingsType: MeldingType;
  meldingsTekst: string;
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
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MeldingTilBehandlerSkjemaValues>();

  const now = new Date();

  const handlePreviewButtonClick = () => {
    setDisplayPreview(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: texts.previewKnapp, url: window.location.href },
    });
  };

  // const validate = (
  //   values: Partial<MeldingTilBehandlerSkjemaValues>
  // ): MeldingTilBehandlerSkjemaFeil => {
  //   const meldingTilBehandlerSkjemaTekst = {
  //     maxLength: MAX_LENGTH_BEHANDLER_MELDING,
  //     value: values.meldingTekst || "",
  //     missingRequiredMessage: texts.validation.missingMeldingTekst,
  //   };
  //   const feilmeldinger: MeldingTilBehandlerSkjemaFeil = {
  //     meldingsType: values.meldingsType
  //       ? undefined
  //       : texts.validation.missingTypeTekst,
  //     behandlerRef: behandlerRefValidationErrors(values.behandlerRef, false),
  //     meldingsTekst: validerTekst(meldingTilBehandlerSkjemaTekst),
  //   };
  //
  //   updateFeilUtbedret(feilmeldinger);
  //   return feilmeldinger;
  // };

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingsType,
      behandlerRef: values.behandlerRef,
      tekst: values[meldingTekstField],
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };
    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => reset, // TODO: Reset for radiogruppe fungerer ikke
    });
  };

  const PreviewButton = () => {
    return (
      <Button
        variant="secondary"
        type="button"
        onClick={handlePreviewButtonClick}
      >
        {texts.previewKnapp}
      </Button>
    );
  };

  const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
    <option value={type}>{meldingTypeTexts[type]}</option>
  );

  return (
    <form onSubmit={handleSubmit(submit)}>
      {meldingTilBehandler.isSuccess && (
        <Alert variant="success" size="small">
          {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
        </Alert>
      )}
      <MeldingsType>
        <Select
          id="type"
          label={texts.meldingsType.label}
          {...register("meldingsType", { required: true })}
          value={watch("meldingsType")}
          error={errors.meldingsType && texts.meldingsType.missing}
        >
          <option value="">{texts.meldingsType.defaultOption}</option>
          <MeldingTypeOption
            type={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
          />
          <MeldingTypeOption
            type={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}
          />
          <MeldingTypeOption type={MeldingType.HENVENDELSE_MELDING_FRA_NAV} />
        </Select>
        {watch("meldingsType") && (
          <MeldingsTypeInfo meldingType={watch("meldingsType")} />
        )}
      </MeldingsType>
      <VelgBehandler
        selectedBehandler={selectedBehandler}
        setSelectedBehandler={setSelectedBehandler}
        register={register}
        errors={errors}
      />
      <Textarea
        label={texts.meldingsTekstLabel}
        {...register("meldingsTekst", {
          required: true,
          maxLength: MAX_LENGTH_BEHANDLER_MELDING,
        })}
        error={errors.meldingsTekst && texts.meldingsTekstErrorMessage}
      />
      <ButtonRow>
        <Button
          variant="primary"
          onClick={handleSubmit(submit)}
          loading={meldingTilBehandler.isLoading}
          type="submit"
        >
          {texts.sendKnapp}
        </Button>
        <PreviewButton />
      </ButtonRow>
    </form>
    // <Form onSubmit={submit} validate={validate}>
    //   {({ handleSubmit, submitFailed, errors, values }) => (
    //     <StyledForm onSubmit={handleSubmit}>
    //       {meldingTilBehandler.isSuccess && (
    //         <Alert variant="success" size="small">
    //           {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
    //         </Alert>
    //       )}
    //       <MeldingsType>
    //         <SelectMeldingType />
    //         {values.type && <MeldingsTypeInfo meldingType={values.type} />}
    //       </MeldingsType>
    //       <VelgBehandler
    //         selectedBehandler={selectedBehandler}
    //         setSelectedBehandler={
    //           setSelectedBehandler
    //         } /* TODO: Skrive oss bort fra state her, bruke values fra form i stedet*/
    //       />
    //       <MeldingTekstfelt />
    //       <Forhandsvisning
    //         contentLabel={texts.previewContentLabel}
    //         isOpen={displayPreview}
    //         handleClose={() => setDisplayPreview(false)}
    //         getDocumentComponents={() => getMeldingTilBehandlerDocument(values)}
    //       />
    //       {meldingTilBehandler.isError && (
    //         <SkjemaInnsendingFeil
    //           error={meldingTilBehandler.error}
    //           bottomPadding={null}
    //         />
    //       )}
    //       {submitFailed && harIkkeUtbedretFeil && (
    //         <SkjemaFeiloppsummering errors={errors} />
    //       )}
    //       <ButtonRow>
    //         <Button
    //           variant="primary"
    //           onClick={resetFeilUtbedret}
    //           loading={meldingTilBehandler.isLoading}
    //           type="submit"
    //         >
    //           {texts.sendKnapp}
    //         </Button>
    //         <PreviewButton />
    //       </ButtonRow>
    //     </StyledForm>
    //   )}
    // </Form>
  );
};
