import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  tilDatoMedManedNavn,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import React, { ReactElement } from "react";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { AktivitetskravAlertstripe } from "@/components/aktivitetskrav/AktivitetskravAlertstripe";
import { BodyLong, BodyShort, Label } from "@navikt/ds-react";

interface AktivitetskravVurderingAlertProps {
  vurdering: AktivitetskravVurderingDTO;
}

type SuccessAktivitetskravStatus =
  | AktivitetskravStatus.OPPFYLT
  | AktivitetskravStatus.UNNTAK
  | AktivitetskravStatus.IKKE_OPPFYLT
  | AktivitetskravStatus.IKKE_AKTUELL;

export const AktivitetskravVurderingAlert = ({
  vurdering,
}: AktivitetskravVurderingAlertProps): ReactElement => {
  const { navn: brukersNavn } = useNavBrukerData();

  const successText = (status: SuccessAktivitetskravStatus): string => {
    const vurderingDatoMedArUtenMndNavn = tilLesbarDatoMedArUtenManedNavn(
      vurdering.createdAt
    );

    switch (status) {
      case AktivitetskravStatus.OPPFYLT: {
        return `Det er vurdert at ${brukersNavn} er i aktivitet ${vurderingDatoMedArUtenMndNavn}`;
      }
      case AktivitetskravStatus.UNNTAK: {
        return `Det er vurdert unntak for ${brukersNavn} ${vurderingDatoMedArUtenMndNavn}`;
      }
      case AktivitetskravStatus.IKKE_OPPFYLT: {
        return `Det er vurdert at aktivitetskravet ikke er oppfylt for ${brukersNavn} ${vurderingDatoMedArUtenMndNavn}`;
      }
      case AktivitetskravStatus.IKKE_AKTUELL: {
        return `Det er vurdert at aktivitetskravet ikke er aktuelt for ${brukersNavn} ${vurderingDatoMedArUtenMndNavn}`;
      }
    }
  };

  switch (vurdering.status) {
    case AktivitetskravStatus.OPPFYLT:
    case AktivitetskravStatus.UNNTAK:
    case AktivitetskravStatus.IKKE_OPPFYLT:
    case AktivitetskravStatus.IKKE_AKTUELL: {
      return (
        <AktivitetskravAlertstripe variant="success">
          <BodyShort size="small">{successText(vurdering.status)}</BodyShort>
        </AktivitetskravAlertstripe>
      );
    }
    case AktivitetskravStatus.AVVENT: {
      return (
        <AktivitetskravAlertstripe variant="warning">
          <Label size="small">
            {vurdering.frist
              ? `Avventer til ${tilDatoMedManedNavn(vurdering.frist)}`
              : "Avventer"}
          </Label>
          <BodyLong size="small">{vurdering.beskrivelse}</BodyLong>
          <ul>
            {vurdering.arsaker.map((arsak, index) => {
              const avventArsakText = avventVurderingArsakTexts[arsak] || arsak;
              return (
                <li key={index}>
                  <BodyShort size="small">{avventArsakText}</BodyShort>
                </li>
              );
            })}
          </ul>
        </AktivitetskravAlertstripe>
      );
    }
    case AktivitetskravStatus.STANS:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
    case AktivitetskravStatus.NY: {
      // Finnes ikke vurderinger med disse statusene
      return <></>;
    }
  }
};
