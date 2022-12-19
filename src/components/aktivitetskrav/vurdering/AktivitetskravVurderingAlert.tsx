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

const prefixTexts = {
  [AktivitetskravStatus.UNNTAK]: "Det er vurdert unntak for",
  [AktivitetskravStatus.OPPFYLT]: "Det er vurdert at kravet er oppfylt for",
};

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
  switch (vurdering.status) {
    case AktivitetskravStatus.OPPFYLT:
    case AktivitetskravStatus.UNNTAK: {
      return (
        <StyledAlertstripeFullbredde type="suksess">
          {`${prefixTexts[vurdering.status]} ${
            navbruker.navn
          } ${tilLesbarDatoMedArUtenManedNavn(vurdering.createdAt)}`}
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
