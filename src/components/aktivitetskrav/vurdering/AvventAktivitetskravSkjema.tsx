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
import { Normaltekst } from "nav-frontend-typografi";
import { FlexColumn } from "@/components/Layout";
import {
  AvventArsakerCheckboxGruppe,
  vurderAktivitetskravArsakerFieldName,
} from "@/components/aktivitetskrav/vurdering/AvventArsakerCheckboxGruppe";
import {
  VurderAktivitetskravBeskrivelse,
  vurderAktivitetskravBeskrivelseFieldName,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";

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
      subtitle={
        <FlexColumn>
          <Normaltekst>{texts.subtitle1}</Normaltekst>
          <Normaltekst>{texts.subtitle2}</Normaltekst>
        </FlexColumn>
      }
      beskrivelse={
        <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
      }
      arsakVelger={<AvventArsakerCheckboxGruppe />}
      toDto={(values) => createDto(values.arsaker, values.beskrivelse)}
      validate={validate}
      {...props}
    />
  );
};
