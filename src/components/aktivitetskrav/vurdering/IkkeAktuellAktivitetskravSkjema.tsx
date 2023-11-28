import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { BodyShort, Button } from "@navikt/ds-react";
import { useAktivitetskravNotificationAlert } from "@/components/aktivitetskrav/useAktivitetskravNotificationAlert";
import { useForm } from "react-hook-form";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
  body: "Aktivitetskravet skal ikke vurderes for denne personen. Ved å lagre fjerner du hendelsen fra oversikten.",
  begrunnelseLabel: "Begrunnelse",
};

interface IkkeAktuellAktivitetskravSkjemaProps
  extends VurderAktivitetskravSkjemaProps {
  setModalOpen: (isOpen: boolean) => void;
}

interface SkjemaValues {
  begrunnelse?: string;
}

export const IkkeAktuellAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: IkkeAktuellAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const { displayNotification } = useAktivitetskravNotificationAlert();

  const { handleSubmit, register, watch } = useForm<SkjemaValues>();
  const onSubmit = (values: SkjemaValues) => {
    const isBlank = values.begrunnelse?.trim() === "";
    const status = AktivitetskravStatus.IKKE_AKTUELL;
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status,
      beskrivelse: isBlank ? undefined : values.begrunnelse,
      arsaker: [],
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => {
        setModalOpen(false);
        displayNotification(status);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BodyShort className="mb-8" size="small">
        {texts.body}
      </BodyShort>
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
