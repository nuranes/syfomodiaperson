import {
  VurderAktivitetskravSkjema,
  VurderAktivitetskravSkjemaProps,
} from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravSkjema";
import { useAktivitetskravVurderingSkjema } from "@/hooks/aktivitetskrav/useAktivitetskravVurderingSkjema";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import React from "react";
import { FlexColumn } from "@/components/Layout";
import { Normaltekst } from "nav-frontend-typografi";

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
      subtitle={
        <FlexColumn>
          <Normaltekst>{texts.subtitle1}</Normaltekst>
        </FlexColumn>
      }
      toDto={() => createDto([])}
      {...props}
    />
  );
};
