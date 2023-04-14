import {
  VurderAktivitetskravSkjema,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";

const texts = {
  title: "Ikke aktuell",
  subtitle1:
    "Aktivitetskravet skal ikke vurderes for denne personen. Ved å lagre fjerner du hendelsen fra oversikten.",
};

export const IkkeAktuellAktivitetskravSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const { createDto } = useAktivitetskravVurderingSkjema(
    AktivitetskravStatus.IKKE_AKTUELL
  );

  return (
    <VurderAktivitetskravSkjema
      title={texts.title}
      subtitles={[texts.subtitle1]}
      toDto={() => createDto([])}
      {...props}
    />
  );
};
