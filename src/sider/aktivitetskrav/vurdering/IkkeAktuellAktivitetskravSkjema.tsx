import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
  IkkeAktuellArsak,
  VarselType,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import {
  BodyShort,
  Button,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";
import { useAktivitetskravNotificationAlert } from "@/sider/aktivitetskrav/useAktivitetskravNotificationAlert";
import { useForm } from "react-hook-form";
import { VurderAktivitetskravSkjemaProps } from "@/sider/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { useAktivitetskravVarselDocument } from "@/hooks/aktivitetskrav/useAktivitetskravVarselDocument";
import { ikkeAktuellVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
  body: "Aktivitetskravet skal ikke vurderes for denne personen. Ved å lagre fjerner du hendelsen fra oversikten.",
  arsak: {
    label: "Velg årsak",
    missing: "Vennligst angi årsak",
  },
  begrunnelse: {
    label: "Begrunnelse",
    missing: "Vennligst angi begrunnelse",
    description: "Når du trykker Lagre journalføres vurderingen automatisk.",
  },
};

const begrunnelseMaxLength = 1000;

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
  const { getVurderingDocument } = useAktivitetskravVarselDocument();
  const { displayNotification } = useAktivitetskravNotificationAlert();

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<SkjemaValues>();

  const onSubmit = (values: SkjemaValues) => {
    const { begrunnelse, arsak } = values;
    const isBlank = begrunnelse?.trim() === "";
    const status = AktivitetskravStatus.IKKE_AKTUELL;
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status,
      beskrivelse: isBlank ? undefined : begrunnelse,
      arsaker: [arsak],
      document: getVurderingDocument({
        varselType: VarselType.IKKE_AKTUELL,
        arsak,
        begrunnelse,
      }),
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => {
        setModalOpen(false);
        displayNotification(status);
        logArsakToAmplitude(values.arsak);
      },
    });
  };
  const isArsakAnnet = watch("arsak") === IkkeAktuellArsak.ANNET;

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
      <Textarea
        className={"mb-4"}
        {...register("begrunnelse", {
          maxLength: begrunnelseMaxLength,
          required: isArsakAnnet,
        })}
        value={watch("begrunnelse")}
        label={texts.begrunnelse.label}
        description={texts.begrunnelse.description}
        error={errors.begrunnelse && texts.begrunnelse.missing}
        size="small"
        minRows={6}
        maxLength={begrunnelseMaxLength}
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
