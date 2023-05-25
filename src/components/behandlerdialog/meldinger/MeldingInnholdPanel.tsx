import React from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { BodyLong, Detail, Panel } from "@navikt/ds-react";
import { PaperclipIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { VisMelding } from "@/components/behandlerdialog/meldinger/VisMelding";
import PdfVedleggLink from "@/components/behandlerdialog/meldinger/PdfVedleggLink";

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
  flex-wrap: wrap;
  margin-bottom: 0.75em;

  > * {
    &:not(:last-child) {
      margin-right: 0.25em;
    }
  }
`;

interface MeldingInnholdPanelProps {
  melding: MeldingDTO;
}

export const MeldingInnholdPanel = ({ melding }: MeldingInnholdPanelProps) => {
  const behandlerNavn = melding.behandlerNavn;
  return (
    <Panel border>
      <MeldingTekst>{melding.tekst}</MeldingTekst>
      {melding.innkommende && melding.antallVedlegg > 0 && (
        <VedleggDetails>
          <PaperclipIcon title="Binders-ikon for vedlegg" fontSize="1.25em" />
          {[...Array(melding.antallVedlegg)].map((_, index) => (
            <PdfVedleggLink
              meldingUuid={melding.uuid}
              vedleggNumber={index}
              key={index}
            />
          ))}
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
    </Panel>
  );
};
