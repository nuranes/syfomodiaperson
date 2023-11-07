import React, { ReactElement } from "react";
import {
  MeldingDTO,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { BodyLong, Detail, Panel } from "@navikt/ds-react";
import { PaperclipIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { VisMelding } from "@/components/behandlerdialog/meldinger/VisMelding";
import PdfVedleggLink from "@/components/behandlerdialog/meldinger/PdfVedleggLink";
import { DocumentComponentType } from "@/data/documentcomponent/documentComponentTypes";
import { PaminnelseWarningIcon } from "@/components/behandlerdialog/paminnelse/PaminnelseWarningIcon";
import { getHeaderText } from "@/utils/documentComponentUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";
import { ReturLegeerklaringWarningIcon } from "@/components/behandlerdialog/legeerklaring/ReturLegeerklaringWarningIcon";

const MeldingTekstWrapper = styled(BodyLong)`
  white-space: pre-wrap;
`;

const MeldingDetails = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;

  > * {
    &:not(:last-child) {
      margin-right: 1em;
    }
  }
`;

const DetailCentered = styled(Detail)`
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

const MeldingTekstContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-flow: row wrap;
  gap: 0.2em;
  align-items: center;
  margin-bottom: 0.75em;
`;

interface MeldingTekstProps {
  melding: MeldingDTO;
}

const MeldingTekst = ({ melding }: MeldingTekstProps): ReactElement => {
  const { tekst, type, innkommende, document } = melding;
  const isPaminnelseTilBehandler =
    type === MeldingType.FORESPORSEL_PASIENT_PAMINNELSE && !innkommende;
  const isReturLegeerklaring =
    type === MeldingType.HENVENDELSE_RETUR_LEGEERKLARING;

  if (isPaminnelseTilBehandler) {
    const headerText = getHeaderText(document, DocumentComponentType.HEADER_H1);
    return (
      <>
        <MeldingTekstWrapper>{headerText}</MeldingTekstWrapper>
        <PaminnelseWarningIcon />
      </>
    );
  } else {
    return (
      <>
        <MeldingTekstWrapper>{tekst}</MeldingTekstWrapper>
        {isReturLegeerklaring && <ReturLegeerklaringWarningIcon />}
      </>
    );
  }
};

interface MeldingInnholdPanelProps {
  melding: MeldingDTO;
}

export const MeldingInnholdPanel = ({ melding }: MeldingInnholdPanelProps) => {
  const { data: veilederInfo } = useVeilederInfoQuery(
    melding.veilederIdent ?? ""
  );
  const avsender = melding.innkommende
    ? melding.behandlerNavn
    : veilederInfo?.navn;

  return (
    <Panel border>
      <MeldingTekstContainer>
        <MeldingTekst melding={melding} />
      </MeldingTekstContainer>
      {melding.innkommende && melding.antallVedlegg > 0 && (
        <VedleggDetails>
          <PaperclipIcon title="Binders-ikon for vedlegg" fontSize="1.25em" />
          {[...Array(melding.antallVedlegg)].map((_, index) => (
            <PdfVedleggLink
              melding={melding}
              vedleggNumber={index}
              key={index}
            />
          ))}
        </VedleggDetails>
      )}
      <MeldingDetails>
        <DetailCentered>
          {tilDatoMedManedNavnOgKlokkeslett(melding.tidspunkt)}
        </DetailCentered>
        <DetailCentered>{meldingTypeTexts[melding.type]}</DetailCentered>
        {avsender && <Detail>{`Skrevet av ${avsender}`}</Detail>}
        {!melding.innkommende && <VisMelding melding={melding} />}
      </MeldingDetails>
    </Panel>
  );
};
