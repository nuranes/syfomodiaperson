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
import { useAktivitetskravNotificationAlert } from "@/components/aktivitetskrav/useAktivitetskravNotificationAlert";

const texts = {
  title: "Er i aktivitet",
  arsakLegend: "Årsak (obligatorisk)",
  begrunnelseLabel: "Begrunnelse",
  missingArsak: "Vennligst angi årsak",
  lagre: "Lagre",
};

export interface OppfyltAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsak: OppfyltVurderingArsak;
}

const defaultValues = { begrunnelse: "", arsak: undefined };

export const OppfyltAktivitetskravSkjema = ({
  aktivitetskravUuid,
}: VurderAktivitetskravSkjemaProps) => {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<OppfyltAktivitetskravSkjemaValues>({
    defaultValues,
  });
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const { displayNotification } = useAktivitetskravNotificationAlert();

  const submit = (values: OppfyltAktivitetskravSkjemaValues) => {
    const status = AktivitetskravStatus.OPPFYLT;
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status,
      arsaker: [values.arsak],
      beskrivelse: values.begrunnelse,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => {
        reset();
        displayNotification(status);
      },
    });
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
          })}
          value={watch("begrunnelse")}
          label={texts.begrunnelseLabel}
        />
      </SkjemaFieldContainer>
      {vurderAktivitetskrav.isError && (
        <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
      )}
      <Button loading={vurderAktivitetskrav.isPending} type="submit">
        {texts.lagre}
      </Button>
    </form>
  );
};
