import React from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import { BodyLong, Detail, Panel } from "@navikt/ds-react";
import styled from "styled-components";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";

const StyledPanel = styled(Panel)`
  width: 80%;
`;

const MeldingTekst = styled(BodyLong)`
  margin-bottom: 0.75em;
`;

const MeldingDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  > * {
    &:not(:last-child) {
      margin-right: 1em;
    }
  }
`;

interface MeldingInnholdPanelProps {
  melding: Melding;
}

export const MeldingInnholdPanel = ({ melding }: MeldingInnholdPanelProps) => {
  const behandlerNavn = melding.behandlerNavn;
  return (
    <StyledPanel border>
      <MeldingTekst>{melding.tekst}</MeldingTekst>
      <MeldingDetails>
        <Detail>{tilDatoMedManedNavnOgKlokkeslett(melding.tidspunkt)}</Detail>
        {melding.innkommende && behandlerNavn && (
          <Detail>{`Skrevet av ${behandlerNavn}`}</Detail>
        )}
      </MeldingDetails>
    </StyledPanel>
  );
};
