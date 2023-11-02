import React, { useState } from "react";
import { SendForhandsvarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { ButtonRow, PaddingSize } from "@/components/Layout";
import { Alert, Button } from "@navikt/ds-react";
import styled from "styled-components";
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
import { Forhandsvisning } from "@/components/Forhandsvisning";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  forhandsvisning: "Forhåndsvisning",
  forhandsvisningLabel: "Forhåndsvis forhåndsvarselet",
  missingBeskrivelse: "Vennligst angi begrunnelse",
  info: "NB! Forhåndsvarsel skal ikke brukes til å hente mer informasjon om saken.",
  sendVarselButtonText: "Send",
  avbrytButtonText: "Avbryt",
};

const VarselbrevContent = styled.div`
  > * {
    margin-bottom: ${PaddingSize.SM};
    &:last-child {
      margin-bottom: ${PaddingSize.MD};
    }
  }
`;

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
      <VarselbrevContent>
        <Alert variant="info" className="max-w-max">
          {texts.info}
        </Alert>
        <BegrunnelseTextarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: true,
          })}
          value={watch("begrunnelse")}
          label={texts.beskrivelseLabel}
          error={errors.begrunnelse && texts.missingBeskrivelse}
        />
      </VarselbrevContent>
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
      <Forhandsvisning
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
