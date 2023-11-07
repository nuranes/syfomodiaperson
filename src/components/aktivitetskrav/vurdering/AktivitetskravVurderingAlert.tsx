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
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { hasUbehandletPersonoppgave } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";

const texts = {
  forhandsvarselInfoBody:
    "Når fristen har passert vil det dukke opp en hendelse til deg i oversikten.",
  forhandsvarselWarningLabel: "Aktivitetskravet må vurderes",
  forhandsvarselWarningBody:
    "Fristen er gått ut og aktivitetskravet må vurderes.",
};

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
}: AktivitetskravVurderingAlertProps): ReactElement | null => {
  const { navn: brukersNavn } = useNavBrukerData();
  const { data: oppgaver } = usePersonoppgaverQuery();
  const hasUbehandletVurderStansOppgave = hasUbehandletPersonoppgave(
    oppgaver,
    PersonOppgaveType.AKTIVITETSKRAV_VURDER_STANS
  );
  const vurderingDato = tilLesbarDatoMedArUtenManedNavn(vurdering.createdAt);

  const successText = (status: SuccessAktivitetskravStatus): string => {
    switch (status) {
      case AktivitetskravStatus.OPPFYLT: {
        return `Det er vurdert at ${brukersNavn} er i aktivitet ${vurderingDato}`;
      }
      case AktivitetskravStatus.UNNTAK: {
        return `Det er vurdert unntak for ${brukersNavn} ${vurderingDato}`;
      }
      case AktivitetskravStatus.IKKE_OPPFYLT: {
        return `Det er vurdert at aktivitetskravet ikke er oppfylt for ${brukersNavn} ${vurderingDato}`;
      }
      case AktivitetskravStatus.IKKE_AKTUELL: {
        return `Det er vurdert at aktivitetskravet ikke er aktuelt for ${brukersNavn} ${vurderingDato}`;
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
    case AktivitetskravStatus.FORHANDSVARSEL: {
      return hasUbehandletVurderStansOppgave ? (
        <AktivitetskravAlertstripe variant="warning">
          <Label size="small">{texts.forhandsvarselWarningLabel}</Label>
          <BodyShort size="small">{`Det ble sendt ut et forhåndsvarsel ${vurderingDato}.`}</BodyShort>
          <BodyShort size="small">{texts.forhandsvarselWarningBody}</BodyShort>
        </AktivitetskravAlertstripe>
      ) : (
        <AktivitetskravAlertstripe variant="info">
          <Label size="small">{`Forhåndsvarsel er sendt ${vurderingDato}`}</Label>
          <BodyShort size="small">{texts.forhandsvarselInfoBody}</BodyShort>
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
    case AktivitetskravStatus.LUKKET:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
    case AktivitetskravStatus.NY_VURDERING:
    case AktivitetskravStatus.NY: {
      // Finnes ikke vurderinger med disse statusene
      return null;
    }
  }
};
