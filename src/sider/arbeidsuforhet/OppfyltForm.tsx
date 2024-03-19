import React from "react";
import { BodyShort, Box, Button, Heading, Textarea } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { useForm } from "react-hook-form";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { useArbeidsuforhetVurderingDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVurderingDocument";
import { useSendVurderingArbeidsuforhet } from "@/data/arbeidsuforhet/useSendVurderingArbeidsuforhet";

const texts = {
  title: "Skriv en kort begrunnelse for hvorfor bruker oppfyller § 8-4",
  info: "Det du skriver her blir liggende i historikken på brukeren og bruker vil få innsyn i notatet om de har behov.",
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  begrunnelseDescription: "Åpne forhåndsvisning for å se innstillingen.",
  forDuGarVidere: {
    head: "Før du går videre bør du gjøre følgende",
    step1: "Informere bruker om utfallet av vurderingen.",
    step2:
      "Informere NAV Arbeid og ytelser via Gosys dersom det var de som initierte vurderingen av arbeidsuførheten",
  },
  forhandsvisningLabel: "Forhåndsvis brev",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Send",
};

const defaultValues = { begrunnelse: "" };
const begrunnelseMaxLength = 1000;

interface SkjemaValues {
  begrunnelse: string;
}

export const OppfyltForm = () => {
  const sendVurdering = useSendVurderingArbeidsuforhet();
  const { getVurderingDocument } = useArbeidsuforhetVurderingDocument();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<SkjemaValues>({ defaultValues });
  const type = VurderingType.OPPFYLT;

  const submit = (values: SkjemaValues) => {
    const vurderingRequestDTO: VurderingRequestDTO = {
      type,
      begrunnelse: values.begrunnelse,
      document: getVurderingDocument({
        begrunnelse: values.begrunnelse,
        type,
      }),
    };
    sendVurdering.mutate(vurderingRequestDTO);
  };

  return (
    <Box background="surface-default" padding="3" className="mb-2">
      <form onSubmit={handleSubmit(submit)}>
        <Heading className="mt-4 mb-4" level="2" size="small">
          {texts.title}
        </Heading>
        <BodyShort className="mb-4">{texts.info}</BodyShort>
        <Textarea
          className="mb-8"
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: texts.missingBegrunnelse,
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
          description={texts.begrunnelseDescription}
          error={errors.begrunnelse?.message}
          size="small"
          minRows={6}
          maxLength={begrunnelseMaxLength}
        />
        {sendVurdering.isError && (
          <SkjemaInnsendingFeil error={sendVurdering.error} />
        )}
        <b>{texts.forDuGarVidere.head}</b>
        <ol>
          <li>{texts.forDuGarVidere.step1}</li>
          <li>{texts.forDuGarVidere.step2}</li>
        </ol>
        <ButtonRow>
          <Button loading={sendVurdering.isPending} type="submit">
            {texts.sendVarselButtonText}
          </Button>
          <Forhandsvisning
            contentLabel={texts.forhandsvisningLabel}
            getDocumentComponents={() =>
              getVurderingDocument({
                begrunnelse: watch("begrunnelse"),
                type,
              })
            }
            title={texts.forhandsvisningLabel}
          />
        </ButtonRow>
      </form>
    </Box>
  );
};
