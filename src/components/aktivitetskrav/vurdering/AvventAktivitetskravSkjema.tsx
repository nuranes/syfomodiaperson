import React from "react";
import {
  AktivitetskravStatus,
  AvventVurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import {
  VurderAktivitetskravSkjema,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import {
  AvventArsakerCheckboxGruppe,
  vurderAktivitetskravArsakerFieldName,
} from "@/components/aktivitetskrav/vurdering/AvventArsakerCheckboxGruppe";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import {
  avventerFristDatoField,
  AvventFristDato,
} from "@/components/aktivitetskrav/vurdering/AvventFristDato";

const texts = {
  title: "Avventer",
  subtitle1:
    "Informasjonen du oppgir her vil kun brukes til videre saksbehandling.",
  subtitle2: "Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  beskrivelseLabel: "Beskrivelse (obligatorisk)",
};

interface AvventAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakerFieldName]: AvventVurderingArsak[];
  [avventerFristDatoField]?: string;
}

export const AvventAktivitetskravSkjema = (
  props: VurderAktivitetskravSkjemaProps
) => {
  const { createDto, validateArsakerField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema(AktivitetskravStatus.AVVENT);

  const validate = (values: Partial<AvventAktivitetskravSkjemaValues>) => ({
    ...validateArsakerField(values.arsaker),
    ...validateBeskrivelseField(values.beskrivelse, true),
  });

  return (
    <VurderAktivitetskravSkjema<AvventAktivitetskravSkjemaValues>
      title={texts.title}
      subtitles={[texts.subtitle1, texts.subtitle2]}
      toDto={(values) =>
        createDto(values.arsaker, values.beskrivelse, values.fristDato)
      }
      validate={validate}
      {...props}
    >
      <AvventArsakerCheckboxGruppe />
      <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
      <AvventFristDato />
    </VurderAktivitetskravSkjema>
  );
};
