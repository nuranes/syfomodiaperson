import React from "react";
import { SendForhandsvarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { addWeeks } from "@/utils/datoUtils";
import { ButtonRow, FlexRow, PaddingSize } from "@/components/Layout";
import { Alert, Button, Heading, Label, Panel } from "@navikt/ds-react";
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

const texts = {
  title: "Send forhåndsvarsel",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  forhandsvisning: "Forhåndsvisning",
  missingBeskrivelse: "Vennligst angi beskrivelse",
  warning:
    "Husk å utrede saken tilstrekkelig før du sender forhåndsvarsel om stans av sykepengene.",
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

const StyledForm = styled.form`
  max-width: 50em;
`;

const forhandsvarselFrist = addWeeks(new Date(), 3);

export const SendForhandsvarselSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const sendForhandsvarsel = useSendForhandsvarsel(aktivitetskravUuid);
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<AktivitetskravSkjemaValues>();
  const { getForhandsvarselDocument } = useAktivitetskravVarselDocument();

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
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit(submit)}>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <Heading level="2" size="large">
          {texts.title}
        </Heading>
      </FlexRow>
      <VarselbrevContent>
        <Alert variant={"warning"}>{texts.warning}</Alert>
        <BegrunnelseTextarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: true,
          })}
          value={watch("begrunnelse")}
          label={texts.beskrivelseLabel}
          error={errors.begrunnelse && texts.missingBeskrivelse}
        />
        <Label size="small">{texts.forhandsvisning}</Label>
        <Panel border>
          {getForhandsvarselDocument(
            watch("begrunnelse"),
            forhandsvarselFrist
          ).map((component, index) => (
            <DocumentComponentVisning
              documentComponent={component}
              key={index}
            />
          ))}
        </Panel>
      </VarselbrevContent>
      {sendForhandsvarsel.isError && (
        <SkjemaInnsendingFeil error={sendForhandsvarsel.error} />
      )}
      <ButtonRow>
        <Button loading={sendForhandsvarsel.isLoading} type="submit">
          {texts.sendVarselButtonText}
        </Button>
        <Button variant="tertiary" onClick={() => setModalOpen(false)}>
          {texts.avbrytButtonText}
        </Button>
      </ButtonRow>
    </StyledForm>
  );
};
