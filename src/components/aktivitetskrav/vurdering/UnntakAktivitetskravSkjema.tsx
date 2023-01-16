import React from "react";
import {
  AktivitetskravStatus,
  UnntakVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  vurderAktivitetskravArsakFieldName,
  VurderAktivitetskravArsakRadioGruppe,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravArsakRadioGruppe";
import { unntakVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
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
  title: "Sett unntak fra aktivitetskravet",
};

interface UnntakAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakFieldName]: UnntakVurderingArsak;
}

export const UnntakAktivitetskravSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const { createDto, validateArsakField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema(AktivitetskravStatus.UNNTAK);

  const validate = (values: Partial<UnntakAktivitetskravSkjemaValues>) => ({
    ...validateArsakField(values.arsak),
    ...validateBeskrivelseField(values.beskrivelse, false),
  });

  return (
    <VurderAktivitetskravSkjema<UnntakAktivitetskravSkjemaValues>
      title={texts.title}
      arsakVelger={
        <VurderAktivitetskravArsakRadioGruppe
          arsakTexts={unntakVurderingArsakTexts}
        />
      }
      beskrivelse={<VurderAktivitetskravBeskrivelse />}
      toDto={(values) => createDto([values.arsak], values.beskrivelse)}
      validate={validate}
      {...props}
    />
  );
};
