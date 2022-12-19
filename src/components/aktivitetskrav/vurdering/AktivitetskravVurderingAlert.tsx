import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { useNavBrukerData } from "@/data/navbruker/navbruker_hooks";
import {
  tilDatoMedManedNavn,
  tilLesbarDatoMedArUtenManedNavn,
} from "@/utils/datoUtils";
import React from "react";
import { FlexRow, PaddingSize } from "@/components/Layout";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";
import styled from "styled-components";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

const StyledAlertstripeFullbredde = styled(AlertstripeFullbredde)`
  margin-bottom: 1em;
`;

interface AktivitetskravVurderingAlertProps {
  vurdering: AktivitetskravVurderingDTO;
}

export const AktivitetskravVurderingAlert = ({
  vurdering,
}: AktivitetskravVurderingAlertProps) => {
  const navbruker = useNavBrukerData();
  const vurderingDatoMedArUtenMndNavn = tilLesbarDatoMedArUtenManedNavn(
    vurdering.createdAt
  );
  switch (vurdering.status) {
    case AktivitetskravStatus.OPPFYLT:
      return (
        <StyledAlertstripeFullbredde type="suksess">
          {`Det er vurdert at ${navbruker.navn} er i aktivitet ${vurderingDatoMedArUtenMndNavn}`}
        </StyledAlertstripeFullbredde>
      );
    case AktivitetskravStatus.UNNTAK: {
      return (
        <StyledAlertstripeFullbredde type="suksess">
          {`Det er vurdert unntak for ${navbruker.navn} ${vurderingDatoMedArUtenMndNavn}`}
        </StyledAlertstripeFullbredde>
      );
    }
    case AktivitetskravStatus.AVVENT: {
      return (
        <StyledAlertstripeFullbredde type="advarsel">
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
        </StyledAlertstripeFullbredde>
      );
    }
    default:
      return <></>;
  }
};
