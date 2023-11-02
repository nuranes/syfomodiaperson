import React from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  OppfyltVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { oppfyltVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  AktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { SkjemaFieldContainer } from "@/components/aktivitetskrav/vurdering/SkjemaFieldContainer";
import { useForm } from "react-hook-form";
import { Button, Radio, RadioGroup } from "@navikt/ds-react";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";

const texts = {
  title: "Er i aktivitet",
  arsakLegend: "Årsak (obligatorisk)",
  begrunnelseLabel: "Begrunnelse (obligatorisk)",
  missingArsak: "Vennligst angi årsak",
  missingBegrunnelse: "Vennligst angi begrunnelse",
  lagre: "Lagre",
};

export interface OppfyltAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsak: OppfyltVurderingArsak;
}

export const OppfyltAktivitetskravSkjema = ({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<OppfyltAktivitetskravSkjemaValues>();
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);

  const submit = (values: OppfyltAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.OPPFYLT,
      arsaker: [values.arsak],
      beskrivelse: values.begrunnelse,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO);
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <SkjemaHeading title={texts.title} />
      <SkjemaFieldContainer>
        <RadioGroup
          name="arsak"
          size="small"
          legend={texts.arsakLegend}
          error={errors.arsak && texts.missingArsak}
        >
          {Object.entries(oppfyltVurderingArsakTexts).map(
            ([arsak, text], index) => (
              <Radio
                key={index}
                value={arsak}
                {...register("arsak", { required: true })}
              >
                {text}
              </Radio>
            )
          )}
        </RadioGroup>
        <BegrunnelseTextarea
          {...register("begrunnelse", {
            maxLength: begrunnelseMaxLength,
            required: true,
          })}
          error={errors.begrunnelse && texts.missingBegrunnelse}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
        />
      </SkjemaFieldContainer>
      {vurderAktivitetskrav.isError && (
        <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
      )}
      <Button loading={vurderAktivitetskrav.isLoading} type="submit">
        {texts.lagre}
      </Button>
    </form>
  );
};
