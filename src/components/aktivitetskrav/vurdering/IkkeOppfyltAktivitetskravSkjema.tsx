import {
  VurderAktivitetskravSkjema,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";

const texts = {
  title: "Ikke oppfylt",
  subtitle1:
    "Innstilling må skrives og sendes til NAY i Gosys. Ved å lagre fjerner du hendelsen fra oversikten.",
};

export const IkkeOppfyltAktivitetskravSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const { createDto } = useAktivitetskravVurderingSkjema(
    AktivitetskravStatus.IKKE_OPPFYLT
  );
  return (
    <VurderAktivitetskravSkjema<Record<string, never>>
      title={texts.title}
      subtitles={[texts.subtitle1]}
      toDto={() => createDto([])}
      {...props}
    />
  );
};
