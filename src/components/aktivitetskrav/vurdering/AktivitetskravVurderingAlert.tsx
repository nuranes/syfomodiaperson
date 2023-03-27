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
import { Element, Normaltekst } from "nav-frontend-typografi";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { AktivitetskravAlertstripe } from "@/components/aktivitetskrav/AktivitetskravAlertstripe";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";

interface AktivitetskravVurderingAlertProps {
  vurdering: AktivitetskravVurderingDTO;
}

export const AktivitetskravVurderingAlert = ({
  vurdering,
}: AktivitetskravVurderingAlertProps): ReactElement => {
  const navbruker = useNavBrukerData();
  const vurderingDatoMedArUtenMndNavn = tilLesbarDatoMedArUtenManedNavn(
    vurdering.createdAt
  );
  const { isFeatureEnabled } = useFeatureToggles();
  const visFristFelt = isFeatureEnabled(
    ToggleNames.aktivitetskravVurderingFrist
  );
  switch (vurdering.status) {
    case AktivitetskravStatus.OPPFYLT:
      return (
        <AktivitetskravAlertstripe type="suksess">
          {`Det er vurdert at ${navbruker.navn} er i aktivitet ${vurderingDatoMedArUtenMndNavn}`}
        </AktivitetskravAlertstripe>
      );
    case AktivitetskravStatus.UNNTAK: {
      return (
        <AktivitetskravAlertstripe type="suksess">
          {`Det er vurdert unntak for ${navbruker.navn} ${vurderingDatoMedArUtenMndNavn}`}
        </AktivitetskravAlertstripe>
      );
    }
    case AktivitetskravStatus.AVVENT: {
      return (
        <AktivitetskravAlertstripe type="advarsel">
          {visFristFelt && vurdering.frist ? (
            <Element>
              Avventer til {tilDatoMedManedNavn(vurdering.frist)}
            </Element>
          ) : (
            <Element>
              Avventer - {tilDatoMedManedNavn(vurdering.createdAt)}
            </Element>
          )}
          <Normaltekst>{vurdering.beskrivelse}</Normaltekst>
          <ul>
            {vurdering.arsaker.map((arsak, index) => {
              const avventArsakText = avventVurderingArsakTexts[arsak] || arsak;
              return <li key={index}>{avventArsakText}</li>;
            })}
          </ul>
        </AktivitetskravAlertstripe>
      );
    }
    case AktivitetskravStatus.IKKE_OPPFYLT: {
      return (
        <AktivitetskravAlertstripe type="suksess">
          {`Det er vurdert at aktivitetskravet ikke er oppfylt for ${navbruker.navn} ${vurderingDatoMedArUtenMndNavn}`}
        </AktivitetskravAlertstripe>
      );
    }
    default:
      return <></>;
  }
};
