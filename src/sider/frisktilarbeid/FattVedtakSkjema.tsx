import React, { useState } from "react";
import {
  Box,
  Button,
  DatePicker,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { FormProvider, useForm } from "react-hook-form";
import { VedtakFraDato } from "@/sider/frisktilarbeid/VedtakFraDato";
import { addWeeks } from "@/utils/datoUtils";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";
import { useFattVedtak } from "@/data/frisktilarbeid/useFattVedtak";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { VedtakRequestDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import dayjs from "dayjs";
import { behandlerNavn } from "@/utils/behandlerUtils";
import { createHeaderH1 } from "@/utils/documentComponentUtils";
import { useFriskmeldingTilArbeidsformidlingDocument } from "@/hooks/frisktilarbeid/useFriskmeldingTilArbeidsformidlingDocument";

const begrunnelseMaxLength = 5000;

const texts = {
  begrunnelseMissing: "Vennligst angi begrunnelse",
  begrunnelseLabel: "Begrunnelse",
  begrunnelseDescription: "Åpne forhåndsvisning for å se hele vedtaket",
  previewContentLabel: "Forhåndsvis vedtaket",
  primaryButton: "Fatt vedtak",
  velgBehandlerLegend: "Velg behandler",
  tilDatoLabel: "Til dato (automatisk justert 12 uker frem)",
  tilDatoDescription: "Dette er datoen vedtaket slutter",
};

export interface FattVedtakSkjemaValues {
  fraDato: Date;
  begrunnelse: string;
  behandlerRef: string;
}

export const FattVedtakSkjema = () => {
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const fattVedtak = useFattVedtak();
  const { getBehandlermeldingDocument } =
    useFriskmeldingTilArbeidsformidlingDocument();
  const methods = useForm<FattVedtakSkjemaValues>();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = methods;

  const fraDato = watch("fraDato");
  const tilDato = addWeeks(fraDato, 12);

  const submit = (values: FattVedtakSkjemaValues) => {
    const vedtakRequestDTO: VedtakRequestDTO = {
      fom: dayjs(values.fraDato).format("YYYY-MM-DD"),
      tom: dayjs(tilDato).format("YYYY-MM-DD"),
      begrunnelse: values.begrunnelse,
      document: [createHeaderH1("Vedtak")],
      behandlerRef: values.behandlerRef,
      behandlerNavn: selectedBehandler ? behandlerNavn(selectedBehandler) : "",
      behandlerDocument: getBehandlermeldingDocument({
        fom: values.fraDato,
        tom: tilDato,
      }),
    };
    fattVedtak.mutate(vedtakRequestDTO);
  };

  const tilDatoDatePicker = useDatepicker();

  return (
    <Box background="surface-default" padding="6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <VedtakFraDato />
            <DatePicker {...tilDatoDatePicker.datepickerProps}>
              <DatePicker.Input
                value={tilDato ? dayjs(tilDato).format("DD.MM.YYYY") : ""}
                label={texts.tilDatoLabel}
                description={texts.tilDatoDescription}
                readOnly
              />
            </DatePicker>
            <VelgBehandler
              legend={texts.velgBehandlerLegend}
              onBehandlerSelected={setSelectedBehandler}
            />
            <Textarea
              {...register("begrunnelse", {
                required: texts.begrunnelseMissing,
                maxLength: begrunnelseMaxLength,
              })}
              minRows={6}
              maxLength={begrunnelseMaxLength}
              description={texts.begrunnelseDescription}
              label={texts.begrunnelseLabel}
              error={errors.begrunnelse?.message}
            />
          </div>
          {fattVedtak.isError && (
            <SkjemaInnsendingFeil error={fattVedtak.error} />
          )}
          <div className="flex gap-4">
            <Button
              variant="primary"
              loading={fattVedtak.isPending}
              type="submit"
            >
              {texts.primaryButton}
            </Button>
            <Forhandsvisning
              contentLabel={texts.previewContentLabel}
              getDocumentComponents={() => []}
            />
          </div>
        </form>
      </FormProvider>
    </Box>
  );
};
