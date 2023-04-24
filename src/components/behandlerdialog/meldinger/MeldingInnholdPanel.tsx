import React from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import { BodyLong, BodyShort, Detail, Panel } from "@navikt/ds-react";
import { PaperclipIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { VisMelding } from "@/components/behandlerdialog/meldinger/VisMelding";

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

const MeldingTidspunkt = styled(Detail)`
  align-self: center;
`;

const VedleggDetails = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 0.75em;

  > * {
    &:not(:last-child) {
      margin-right: 0.25em;
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
      {melding.innkommende && melding.antallVedlegg > 0 && (
        <VedleggDetails>
          <PaperclipIcon title="Binders-ikon for vedlegg" fontSize="1.25em" />
          <BodyShort>
            {`${melding.antallVedlegg} vedlegg. Se i Gosys.`}
          </BodyShort>
        </VedleggDetails>
      )}
      <MeldingDetails>
        <MeldingTidspunkt>
          {tilDatoMedManedNavnOgKlokkeslett(melding.tidspunkt)}
        </MeldingTidspunkt>
        {melding.innkommende && behandlerNavn && (
          <Detail>{`Skrevet av ${behandlerNavn}`}</Detail>
        )}
        {!melding.innkommende && <VisMelding melding={melding} />}
      </MeldingDetails>
    </StyledPanel>
  );
};
