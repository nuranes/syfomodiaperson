import React from "react";
import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { AvventFristDato } from "@/components/aktivitetskrav/vurdering/AvventFristDato";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { LagreAvbrytButtonRow } from "@/components/aktivitetskrav/vurdering/LagreAvbrytButtonRow";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  AktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { SkjemaFieldContainer } from "@/components/aktivitetskrav/vurdering/SkjemaFieldContainer";
import { FormProvider, useForm } from "react-hook-form";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";

const texts = {
  title: "Avventer",
  subtitle1:
    "Informasjonen du oppgir her vil kun brukes til videre saksbehandling.",
  subtitle2: "Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
  arsakLegend: "Årsak (obligatorisk)",
  missingArsak: "Vennligst angi årsak",
  missingBeskrivelse: "Vennligst angi beskrivelse",
};

export interface AvventAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsaker: AvventVurderingArsak[];
  fristDato?: string;
}

export const AvventAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const methods = useForm<AvventAktivitetskravSkjemaValues>();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = methods;

  const submit = (values: AvventAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.AVVENT,
      arsaker: values.arsaker,
      beskrivelse: values.begrunnelse,
      frist: values.fristDato,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submit)}>
        <SkjemaHeading
          title={texts.title}
          subtitles={[texts.subtitle1, texts.subtitle2]}
        />
        <SkjemaFieldContainer>
          <CheckboxGroup
            size="small"
            legend={texts.arsakLegend}
            error={errors.arsaker && texts.missingArsak}
          >
            {Object.entries(avventVurderingArsakTexts).map(
              ([arsak, text], index) => (
                <Checkbox
                  key={index}
                  value={arsak}
                  {...register("arsaker", { required: true })}
                >
                  {text}
                </Checkbox>
              )
            )}
          </CheckboxGroup>
          <BegrunnelseTextarea
            {...register("beskrivelse", {
              maxLength: begrunnelseMaxLength,
              required: true,
            })}
            value={watch("beskrivelse")}
            label={texts.beskrivelseLabel}
            error={errors.beskrivelse && texts.missingBeskrivelse}
          />
          <AvventFristDato />
        </SkjemaFieldContainer>
        {vurderAktivitetskrav.isError && (
          <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
        )}
        <LagreAvbrytButtonRow
          isSubmitting={vurderAktivitetskrav.isLoading}
          handleClose={() => setModalOpen(false)}
        />
      </form>
    </FormProvider>
  );
};
