import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  IkkeAktuellArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { BodyShort, Button, Radio, RadioGroup } from "@navikt/ds-react";
import { useAktivitetskravNotificationAlert } from "@/components/aktivitetskrav/useAktivitetskravNotificationAlert";
import { useForm } from "react-hook-form";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";
import { ikkeAktuellVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
  body: "Aktivitetskravet skal ikke vurderes for denne personen. Ved å lagre fjerner du hendelsen fra oversikten.",
  begrunnelseLabel: "Begrunnelse",
  arsak: {
    label: "Velg årsak",
    missing: "Vennligst angi årsak",
  },
};

interface IkkeAktuellAktivitetskravSkjemaProps
  extends VurderAktivitetskravSkjemaProps {
  setModalOpen: (isOpen: boolean) => void;
}

interface SkjemaValues {
  arsak: IkkeAktuellArsak;
  begrunnelse?: string;
}

function logArsakToAmplitude(arsak: IkkeAktuellArsak) {
  Amplitude.logEvent({
    type: EventType.IkkeAktuellVurderingArsak,
    data: { arsak: arsak },
  });
}

export const IkkeAktuellAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: IkkeAktuellAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const { displayNotification } = useAktivitetskravNotificationAlert();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<SkjemaValues>();

  const onSubmit = (values: SkjemaValues) => {
    const isBlank = values.begrunnelse?.trim() === "";
    const status = AktivitetskravStatus.IKKE_AKTUELL;
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status,
      beskrivelse: isBlank ? undefined : values.begrunnelse,
      arsaker: [values.arsak],
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => {
        setModalOpen(false);
        displayNotification(status);
        logArsakToAmplitude(values.arsak);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BodyShort className="mb-8" size="small">
        {texts.body}
      </BodyShort>
      <RadioGroup
        name="arsak"
        size="small"
        legend={texts.arsak.label}
        error={errors.arsak && texts.arsak.missing}
        className="mb-8"
      >
        {Object.values(IkkeAktuellArsak).map((arsak, index) => (
          <Radio
            key={index}
            value={arsak}
            {...register("arsak", { required: true })}
          >
            {ikkeAktuellVurderingArsakTexts[arsak]}
          </Radio>
        ))}
      </RadioGroup>
      <BegrunnelseTextarea
        className={"mb-4"}
        {...register("begrunnelse", {
          maxLength: begrunnelseMaxLength,
        })}
        value={watch("begrunnelse")}
        label={texts.begrunnelseLabel}
      />
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
  );
};
