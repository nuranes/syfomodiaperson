import React from "react";
import {
  AktivitetskravStatus,
  CreateAktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { AvventArsakerCheckboxGruppe } from "@/components/aktivitetskrav/vurdering/AvventArsakerCheckboxGruppe";
import { VurderAktivitetskravBeskrivelse } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";
import { AvventFristDato } from "@/components/aktivitetskrav/vurdering/AvventFristDato";
import { Form } from "react-final-form";
import { SkjemaHeading } from "@/components/aktivitetskrav/vurdering/SkjemaHeading";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { LagreAvbrytButtonRow } from "@/components/aktivitetskrav/vurdering/LagreAvbrytButtonRow";
import { useVurderAktivitetskrav } from "@/data/aktivitetskrav/useVurderAktivitetskrav";
import {
  AvventAktivitetskravSkjemaValues,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/vurderAktivitetskravSkjemaTypes";
import { SkjemaFieldContainer } from "@/components/aktivitetskrav/vurdering/SkjemaFieldContainer";

const texts = {
  title: "Avventer",
  subtitle1:
    "Informasjonen du oppgir her vil kun brukes til videre saksbehandling.",
  subtitle2: "Ingenting sendes videre til arbeidstaker eller arbeidsgiver.",
  beskrivelseLabel: "Begrunnelse (obligatorisk)",
};

export const AvventAktivitetskravSkjema = ({
  aktivitetskravUuid,
  setModalOpen,
}: VurderAktivitetskravSkjemaProps) => {
  const vurderAktivitetskrav = useVurderAktivitetskrav(aktivitetskravUuid);
  const submit = (values: AvventAktivitetskravSkjemaValues) => {
    const createAktivitetskravVurderingDTO: CreateAktivitetskravVurderingDTO = {
      status: AktivitetskravStatus.AVVENT,
      arsaker: values.arsaker,
      beskrivelse: values.beskrivelse,
      frist: values.fristDato,
    };
    vurderAktivitetskrav.mutate(createAktivitetskravVurderingDTO, {
      onSuccess: () => setModalOpen(false),
    });
  };
  const { validateArsakerField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema();

  const validate = (values: Partial<AvventAktivitetskravSkjemaValues>) => ({
    ...validateArsakerField(values.arsaker),
    ...validateBeskrivelseField(values.beskrivelse, true),
  });

  return (
    <Form onSubmit={submit} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <SkjemaHeading
            title={texts.title}
            subtitles={[texts.subtitle1, texts.subtitle2]}
          />
          <SkjemaFieldContainer>
            <AvventArsakerCheckboxGruppe />
            <VurderAktivitetskravBeskrivelse label={texts.beskrivelseLabel} />
            <AvventFristDato />
          </SkjemaFieldContainer>
          {vurderAktivitetskrav.isError && (
            <SkjemaInnsendingFeil error={vurderAktivitetskrav.error} />
          )}
          <LagreAvbrytButtonRow
            isSubmitting={vurderAktivitetskrav.isLoading}
            handleClose={() => setModalOpen(false)}
          />
        </form>
      )}
    </Form>
  );
};
