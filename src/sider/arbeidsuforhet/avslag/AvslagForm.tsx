import React from "react";
import { useSendVurderingArbeidsuforhet } from "@/data/arbeidsuforhet/useSendVurderingArbeidsuforhet";
import { useArbeidsuforhetVurderingDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVurderingDocument";
import { FormProvider, useForm } from "react-hook-form";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import {
  BodyShort,
  Box,
  Button,
  Heading,
  List,
  Textarea,
} from "@navikt/ds-react";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { Link } from "react-router-dom";
import { arbeidsuforhetPath } from "@/routers/AppRouter";
import { AvslagDatePicker } from "@/sider/arbeidsuforhet/avslag/AvslagDatePicker";
import dayjs from "dayjs";

const texts = {
  title: "Skriv innstilling til NAY",
  begrunnelseLabel: "Innstilling om avslag (obligatorisk)",
  info1:
    "Skriv kort hvilke opplysninger som ligger til grunn for avslaget, samt din vurdering av hvorfor vilkåret ikke er oppfylt og vurdering av eventuelle nye opplysninger.",
  info2:
    "Hvis du har vurdert ordningen friskmelding til arbeidsformidling: skriv hvorfor ordningen ikke er aktuell og legg inn henvisning til §8-5.",
  afterSendInfo: {
    title: "Videre må du huske å:",
    gosysoppgave: "Sende oppgave til NAY i Gosys.",
    stoppknapp:
      "Gi beskjed om avslag til ny saksbehandlingsløsning via Stoppknappen under fanen Sykmeldinger i Modia.",
  },
  buttonDescription:
    "Når du trykker “Gi avslag” blir innstillingen journalført og kan sees i Gosys.",
  forhandsvisningLabel: "Forhåndsvis innstillingen",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  sendVarselButtonText: "Gi avslag",
  avbrytButton: "Avbryt",
};

const begrunnelseMaxLength = 5000;

export interface ArbeidsuforhetAvslagSkjemaValues {
  begrunnelse: string;
  fom: Date;
}

export const AvslagForm = () => {
  const sendVurdering = useSendVurderingArbeidsuforhet();
  const { getAvslagDocument } = useArbeidsuforhetVurderingDocument();
  const formMethods = useForm<ArbeidsuforhetAvslagSkjemaValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = formMethods;

  const submit = (values: ArbeidsuforhetAvslagSkjemaValues) => {
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.AVSLAG,
      begrunnelse: values.begrunnelse,
      document: getAvslagDocument({
        begrunnelse: values.begrunnelse,
        fom: values.fom,
      }),
      gjelderFom: dayjs(values.fom).format("YYYY-MM-DD"),
    };
    sendVurdering.mutate(vurderingRequestDTO);
  };

  return (
    <Box background="surface-default" padding="4" className="mb-2">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(submit)} className="[&>*]:mb-4">
          <Heading level="2" size="medium">
            {texts.title}
          </Heading>
          <AvslagDatePicker />
          <BodyShort>
            <p>{texts.info1}</p>
            <p>{texts.info2}</p>
          </BodyShort>
          <Textarea
            {...register("begrunnelse", {
              maxLength: begrunnelseMaxLength,
              required: texts.missingBegrunnelse,
            })}
            value={watch("begrunnelse")}
            label={texts.begrunnelseLabel}
            error={errors.begrunnelse?.message}
            size="small"
            minRows={6}
            maxLength={begrunnelseMaxLength}
          />
          {sendVurdering.isError && (
            <SkjemaInnsendingFeil error={sendVurdering.error} />
          )}
          <List as="ul" title={texts.afterSendInfo.title}>
            <List.Item className="ml-8">
              {texts.afterSendInfo.gosysoppgave}
            </List.Item>
            <List.Item className="ml-8">
              {texts.afterSendInfo.stoppknapp}
            </List.Item>
          </List>
          <BodyShort>{texts.buttonDescription}</BodyShort>
          <ButtonRow>
            <Button loading={sendVurdering.isPending} type="submit">
              {texts.sendVarselButtonText}
            </Button>
            <Button as={Link} to={arbeidsuforhetPath} variant="secondary">
              {texts.avbrytButton}
            </Button>
            <Forhandsvisning
              contentLabel={texts.forhandsvisningLabel}
              getDocumentComponents={() =>
                getAvslagDocument({
                  begrunnelse: watch("begrunnelse"),
                  fom: watch("fom"),
                })
              }
            />
          </ButtonRow>
        </form>
      </FormProvider>
    </Box>
  );
};
