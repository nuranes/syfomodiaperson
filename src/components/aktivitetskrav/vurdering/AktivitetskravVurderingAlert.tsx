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
import { FlexRow, PaddingSize } from "@/components/Layout";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { AktivitetskravAlertstripe } from "@/components/aktivitetskrav/AktivitetskravAlertstripe";

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
          <Element>
            Avventer - {tilDatoMedManedNavn(vurdering.createdAt)}
          </Element>
          <FlexRow topPadding={PaddingSize.SM}>
            <Normaltekst>{vurdering.beskrivelse}</Normaltekst>
          </FlexRow>
          <FlexRow topPadding={PaddingSize.SM}>
            <ul>
              {vurdering.arsaker.map((arsak, index) => {
                const avventArsakText =
                  avventVurderingArsakTexts[arsak] || arsak;
                return <li key={index}>{avventArsakText}</li>;
              })}
            </ul>
          </FlexRow>
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
