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
import { VurderAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { vurderAktivitetskravBeskrivelseFieldName } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";

const texts = {
  title: "Aktivitetskravet er oppfylt",
};

interface OppfyltAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakFieldName]: OppfyltVurderingArsak;
}

interface OppfyltAktivitetskravSkjemaProps {
  setModalOpen: (modalOpen: boolean) => void;
  aktivitetskravUuid: string;
}

export const OppfyltAktivitetskravSkjema = ({
  setModalOpen,
  aktivitetskravUuid,
}: OppfyltAktivitetskravSkjemaProps) => {
  const { createDto, validateArsakField, validateBeskrivelseField } =
    useAktivitetskravVurderingSkjema(AktivitetskravStatus.OPPFYLT);

  const validate = (values: Partial<OppfyltAktivitetskravSkjemaValues>) => ({
    ...validateArsakField(values.arsak),
    ...validateBeskrivelseField(values.beskrivelse, false),
  });

  return (
    <VurderAktivitetskravSkjema<OppfyltAktivitetskravSkjemaValues>
      title={texts.title}
      arsakVelger={
        <VurderAktivitetskravArsakRadioGruppe
          arsakTexts={oppfyltVurderingArsakTexts}
        />
      }
      setModalOpen={setModalOpen}
      aktivitetskravUuid={aktivitetskravUuid}
      toDto={(values) => createDto(values.beskrivelse, [values.arsak])}
      validate={validate}
    />
  );
};
