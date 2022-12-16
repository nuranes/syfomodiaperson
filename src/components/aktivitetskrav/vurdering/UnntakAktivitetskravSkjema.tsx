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
import { VurderAktivitetskravSkjema } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { vurderAktivitetskravBeskrivelseFieldName } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravBeskrivelse";

const texts = {
  title: "Sett unntak fra aktivitetskravet",
};

interface UnntakAktivitetskravSkjemaValues {
  [vurderAktivitetskravBeskrivelseFieldName]: string;
  [vurderAktivitetskravArsakFieldName]: UnntakVurderingArsak;
}

interface UnntakAktivitetskravSkjemaProps {
  setModalOpen: (modalOpen: boolean) => void;
  aktivitetskravUuid: string;
}

export const UnntakAktivitetskravSkjema = ({
  setModalOpen,
  aktivitetskravUuid,
}: UnntakAktivitetskravSkjemaProps) => {
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
      setModalOpen={setModalOpen}
      aktivitetskravUuid={aktivitetskravUuid}
      toDto={(values) => createDto(values.beskrivelse, [values.arsak])}
      validate={validate}
    />
  );
};
