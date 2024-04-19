import React, { useState } from "react";
import { Box, Button, Textarea } from "@navikt/ds-react";
import { Forhandsvisning } from "@/components/Forhandsvisning";
import { FormProvider, useForm } from "react-hook-form";
import { VedtakDatoer } from "@/sider/frisktilarbeid/VedtakDatoer";
import { addWeeks } from "@/utils/datoUtils";
import { BehandlerDTO } from "@/data/behandler/BehandlerDTO";
import { VelgBehandler } from "@/components/behandler/VelgBehandler";

const begrunnelseMaxLength = 5000;

const texts = {
  begrunnelseMissing: "Vennligst angi begrunnelse",
  begrunnelseLabel: "Begrunnelse",
  begrunnelseDescription: "Åpne forhåndsvisning for å se hele vedtaket",
  previewContentLabel: "Forhåndsvis vedtaket",
  primaryButton: "Fatt vedtak",
  velgBehandlerLegend: "Velg behandler",
};

export interface FattVedtakSkjemaValues {
  fraDato: string;
  begrunnelse: string;
  behandlerRef: string;
}

export const FattVedtak = () => {
  const [tilDato, setTilDato] = useState<Date>();
  const [selectedBehandler, setSelectedBehandler] = useState<BehandlerDTO>();
  const methods = useForm<FattVedtakSkjemaValues>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleFraDatoChanged = (fraDato: Date) => {
    setTilDato(addWeeks(fraDato, 12));
  };

  const submit = (values: FattVedtakSkjemaValues) => {
    console.log("values", values);
    console.log("behandler", selectedBehandler);
    console.log("tilDato", tilDato);
  };

  return (
    <Box background="surface-default" padding="6">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-6">
            <VedtakDatoer
              tilDato={tilDato}
              onFraDatoChanged={handleFraDatoChanged}
            />
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
          <div className="flex gap-4">
            <Button variant="primary" loading={false} type="submit">
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
