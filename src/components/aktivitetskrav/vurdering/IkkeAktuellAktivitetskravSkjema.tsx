import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { ButtonRow } from "@/components/Layout";
import { Button } from "@navikt/ds-react";
import { useForm } from "react-hook-form";
import { VurderAktivitetskravSkjemaProps } from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import BegrunnelseTextarea, {
  begrunnelseMaxLength,
} from "@/components/aktivitetskrav/vurdering/BegrunnelseTextarea";

const texts = {
  lagre: "Lagre",
  avbryt: "Avbryt",
  title: "Ikke aktuell",
  subtitle1:
    "Aktivitetskravet skal ikke vurderes for denne personen. Ved å lagre fjerner du hendelsen fra oversikten.",
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
  const { handleSubmit, register, watch } = useForm<SkjemaValues>();
  const onSubmit = (values: SkjemaValues) => {
    const isBlank = values.begrunnelse?.trim() === "";
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.IKKE_AKTUELL,
      beskrivelse: isBlank ? undefined : values.begrunnelse,
      arsaker: [],
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SkjemaHeading title={texts.title} subtitles={[texts.subtitle1]} />
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
        <Button loading={vurderAktivitetskrav.isLoading} type="submit">
          {texts.lagre}
        </Button>
        <Button variant="tertiary" onClick={() => setModalOpen(false)}>
          {texts.avbryt}
        </Button>
      </ButtonRow>
    </form>
  );
};
