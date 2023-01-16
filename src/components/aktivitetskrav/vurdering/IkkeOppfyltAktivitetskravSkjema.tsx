import {
  VurderAktivitetskravSkjema,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { Normaltekst } from "nav-frontend-typografi";
import { FlexColumn } from "@/components/Layout";

const texts = {
  title: "Ikke oppfylt",
  subtitle1:
    "Saken må ferdigstilles i Arena. Ta ut oppgaven fra enhetens oversikt.",
  subtitle2: "Hendelsen vil lagres under historikk på personen.",
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
      subtitle={
        <FlexColumn>
          <Normaltekst>{texts.subtitle1}</Normaltekst>
          <Normaltekst>{texts.subtitle2}</Normaltekst>
        </FlexColumn>
      }
      toDto={() => createDto([])}
      {...props}
    />
  );
};
