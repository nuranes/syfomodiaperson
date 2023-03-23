import React from "react";
import {
  AktivitetskravStatus,
  OppfyltVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { oppfyltVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import {
  vurderAktivitetskravArsakFieldName,
  VurderAktivitetskravArsakRadioGruppe,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import {
  VurderAktivitetskravSkjema,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";

const texts = {
  title: "Er i aktivitet",
};

interface OppfyltAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakFieldName]: OppfyltVurderingArsak;
}

export const OppfyltAktivitetskravSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const { createDto, validateArsakField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema(AktivitetskravStatus.OPPFYLT);

  const validate = (values: Partial<OppfyltAktivitetskravSkjemaValues>) => ({
    ...validateArsakField(values.arsak),
    ...validateBeskrivelseField(values.beskrivelse, false),
  });

  return (
    <VurderAktivitetskravSkjema<OppfyltAktivitetskravSkjemaValues>
      title={texts.title}
      toDto={(values) => createDto([values.arsak], values.beskrivelse)}
      validate={validate}
      {...props}
    >
      <VurderAktivitetskravArsakRadioGruppe
        arsakTexts={oppfyltVurderingArsakTexts}
      />
      <VurderAktivitetskravBeskrivelse />
    </VurderAktivitetskravSkjema>
  );
};
