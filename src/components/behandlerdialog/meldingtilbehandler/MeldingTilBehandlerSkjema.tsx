import React, { useState } from "react";
import { Alert, Button, Select, Textarea } from "@navikt/ds-react";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
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
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";

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

export interface MeldingTilBehandlerSkjemaValues {
  behandlerRef: string;
  meldingsType: MeldingType;
  meldingTekst: string;
}

export const MAX_LENGTH_BEHANDLER_MELDING = 5000;

export const MeldingTilBehandlerSkjema = () => {
  const [displayPreview, setDisplayPreview] = useState(false);
  const { getMeldingTilBehandlerDocument } = useMeldingTilBehandlerDocument();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const meldingTilBehandler = useMeldingTilBehandler();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    trigger,
    setError,
  } = useForm<MeldingTilBehandlerSkjemaValues>();

  const now = new Date();

  const handlePreviewButtonClick = () => {
    setDisplayPreview(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: texts.previewKnapp, url: window.location.href },
    });
  };

  const submit = (values: MeldingTilBehandlerSkjemaValues) => {
    const behandlerRefValue = () => {
      if (
        values.behandlerRef === "sokEtterBehandler" &&
        selectedBehandler?.behandlerRef
      ) {
        return selectedBehandler?.behandlerRef;
      } else {
        return values.behandlerRef;
      }
    };
    const meldingTilBehandlerDTO: MeldingTilBehandlerDTO = {
      type: values.meldingsType,
      behandlerRef: behandlerRefValue(),
      tekst: values.meldingTekst,
      document: getMeldingTilBehandlerDocument(values),
      behandlerIdent: selectedBehandler?.fnr,
      behandlerNavn: selectedBehandler
        ? behandlerNavn(selectedBehandler)
        : undefined,
    };
    meldingTilBehandler.mutate(meldingTilBehandlerDTO, {
      onSuccess: () => reset(),
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
    <form onSubmit={handleSubmit(submit)} className={"flex flex-col gap-4"}>
      {meldingTilBehandler.isSuccess && (
        <Alert variant="success" size="small">
          {`Meldingen ble sendt ${tilDatoMedManedNavnOgKlokkeslett(now)}`}
        </Alert>
      )}
      <div className="max-w-[23rem]">
        <Select
          id="type"
          className="mb-4"
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
      </div>
      <VelgBehandler
        selectedBehandler={selectedBehandler}
        setSelectedBehandler={setSelectedBehandler}
        register={register}
        setError={setError}
        watch={watch}
        trigger={trigger}
        errors={errors}
      />
      <Textarea
        label={texts.meldingsTekstLabel}
        {...register("meldingTekst", {
          required: true,
          maxLength: MAX_LENGTH_BEHANDLER_MELDING,
        })}
        error={errors.meldingTekst && texts.meldingsTekstErrorMessage}
      />
      <ForhandsvisningModal
        contentLabel={texts.previewContentLabel}
        isOpen={displayPreview}
        handleClose={() => setDisplayPreview(false)}
        getDocumentComponents={() =>
          getMeldingTilBehandlerDocument(getValues()) ?? []
        }
      />
      <ButtonRow>
        <Button
          variant="primary"
          onClick={handleSubmit(submit)}
          loading={meldingTilBehandler.isPending}
          type="submit"
        >
          {texts.sendKnapp}
        </Button>
        <PreviewButton />
      </ButtonRow>
    </form>
  );
};
