import React from "react";
import {
  AktivitetskravStatus,
  AvventVurderingArsak,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { AvventFristDato } from "@/sider/aktivitetskrav/vurdering/AvventFristDato";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  AktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/sider/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { SkjemaFieldContainer } from "@/sider/aktivitetskrav/vurdering/SkjemaFieldContainer";
import { FormProvider, useForm } from "react-hook-form";
import {
  BodyShort,
  Button,
  Checkbox,
  CheckboxGroup,
  Textarea,
} from "@navikt/ds-react";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { ButtonRow } from "@/components/Layout";

const texts = {
  body1:
    "Informasjonen du oppgir her vil kun brukes til videre saksbehandling.",
  body2: "Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  begrunnelseLabel: "Beskrivelse",
  arsakLegend: "Årsak (obligatorisk)",
  missingArsak: "Vennligst angi årsak",
  lagre: "Lagre",
  avbryt: "Avbryt",
};

const begrunnelseMaxLength = 200;

export interface AvventAktivitetskravSkjemaValues
  extends AktivitetskravSkjemaValues {
  arsaker: AvventVurderingArsak[];
  fristDato?: string;
}

interface AvventAktivitetskravSkjemaProps
  extends VurderAktivitetskravSkjemaProps {
  setModalOpen: (isOpen: boolean) => void;
}

export const AvventAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: AvventAktivitetskravSkjemaProps) => {
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
        <div className="mb-8">
          <BodyShort size="small">{texts.body1}</BodyShort>
          <BodyShort size="small">{texts.body2}</BodyShort>
        </div>
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
          <Textarea
            {...register("begrunnelse", {
              maxLength: begrunnelseMaxLength,
            })}
            value={watch("begrunnelse")}
            label={texts.begrunnelseLabel}
            size="small"
            minRows={3}
            maxLength={begrunnelseMaxLength}
          />
          <AvventFristDato />
        </SkjemaFieldContainer>
        {vurderAktivitetskrav.isError && (
          <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
        )}
        <ButtonRow>
          <Button loading={vurderAktivitetskrav.isPending} type="submit">
            {texts.lagre}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setModalOpen(false)}
          >
            {texts.avbryt}
          </Button>
        </ButtonRow>
      </form>
    </FormProvider>
  );
};
