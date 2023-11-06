import React, { useState } from "react";
import { SendForhandsvarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { ButtonRow } from "@/components/Layout";
import { Button } from "@navikt/ds-react";
import { useSendForhandsvarsel } from "@/data/aktivitetskrav/useSendForhandsvarsel";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import {
  AktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { useForm } from "react-hook-form";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { ForhandsvisningModal } from "@/components/ForhandsvisningModal";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
};

const forhandsvarselFrist = addWeeks(new Date(), 3);
const defaultValues = { begrunnelse: "", arsak: undefined };

export const SendForhandsvarselSkjema = ({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) => {
  const sendForhandsvarsel = useSendForhandsvarsel(aktivitetskravUuid);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<AktivitetskravSkjemaValues>({ defaultValues });
  const { getForhandsvarselDocument } = useAktivitetskravVarselDocument();
  const [showForhandsvisning, setShowForhandsvisning] = useState(false);

  const submit = (values: AktivitetskravSkjemaValues) => {
    const forhandsvarselDTO: SendForhandsvarselDTO = {
      fritekst: values.begrunnelse,
      document: getForhandsvarselDocument(
        values.begrunnelse,
        forhandsvarselFrist
      ),
    };
    if (aktivitetskravUuid) {
      sendForhandsvarsel.mutate(forhandsvarselDTO, {
        onSuccess: () => reset(),
      });
    }
  };

  const handlePreviewButtonClick = () => {
    setShowForhandsvisning(true);
    Amplitude.logEvent({
      type: EventType.ButtonClick,
      data: { tekst: texts.forhandsvisning, url: window.location.href },
    });
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <SkjemaHeading title={texts.title} />
      <BegrunnelseTextarea
        className="mb-8"
        {...register("begrunnelse", {
          maxLength: begrunnelseMaxLength,
          required: true,
        })}
        value={watch("begrunnelse")}
        label={texts.beskrivelseLabel}
        error={errors.begrunnelse && texts.missingBeskrivelse}
      />
      {sendForhandsvarsel.isError && (
        <SkjemaInnsendingFeil error={sendForhandsvarsel.error} />
      )}
      <ButtonRow>
        <Button loading={sendForhandsvarsel.isLoading} type="submit">
          {texts.sendVarselButtonText}
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={handlePreviewButtonClick}
        >
          {texts.forhandsvisning}
        </Button>
      </ButtonRow>
      <ForhandsvisningModal
        contentLabel={texts.forhandsvisningLabel}
        isOpen={showForhandsvisning}
        handleClose={() => setShowForhandsvisning(false)}
        getDocumentComponents={() =>
          getForhandsvarselDocument(watch("begrunnelse"), forhandsvarselFrist)
        }
      />
    </form>
  );
};
