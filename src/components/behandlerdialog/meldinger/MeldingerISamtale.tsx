import React from "react";
import {
  MeldingDTO,
  MeldingStatusType,
  MeldingType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { MeldingInnholdPanel } from "@/components/behandlerdialog/meldinger/MeldingInnholdPanel";
import styled from "styled-components";
import {
  NavLogoRod,
  StetoskopIkonBakgrunn,
} from "../../../../img/ImageComponents";
import { PaminnelseMelding } from "@/components/behandlerdialog/paminnelse/PaminnelseMelding";
import { AvvistMelding } from "@/components/behandlerdialog/meldinger/AvvistMelding";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { ReturLegeerklaring } from "@/components/behandlerdialog/legeerklaring/ReturLegeerklaring";

const StyledWrapper = styled.div`
  margin: 1em 0;

  > * {
    &:not(:last-child) {
      margin-bottom: 1em;
    }
  }
`;

const StyledImageWrapper = styled.div<{ innkommende?: boolean }>`
  margin: ${(props) => (props.innkommende ? "0 1em 0 0" : "0 0 0 1em")};
`;

const StyledMelding = styled.div<{ innkommende?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.innkommende ? "start" : "end")};
`;

const StyledInnhold = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;

  > * {
    &:not(:last-child) {
      margin-bottom: 1em;
    }
  }
`;

interface MeldingInnholdProps {
  melding: MeldingDTO;
}

interface MeldingFraBehandlerProps extends MeldingInnholdProps {
  meldinger: MeldingDTO[];
}

const MeldingFraBehandler = ({
  meldinger,
  melding,
}: MeldingFraBehandlerProps) => {
  const { isFeatureEnabled } = useFeatureToggles();
  const isReturLegeerklaringEnabled = isFeatureEnabled(
    ToggleNames.behandlerdialogReturLegeerklaring
  );
  const isLegeerklaring =
    melding.type === MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING;
  const sentReturForLegeerklaring = meldinger.some(
    (m) =>
      m.type === MeldingType.HENVENDELSE_RETUR_LEGEERKLARING &&
      m.parentRef === melding.uuid
  );
  const showReturLegeerklaring =
    isReturLegeerklaringEnabled &&
    isLegeerklaring &&
    !sentReturForLegeerklaring;

  return (
    <StyledMelding innkommende>
      <StyledImageWrapper innkommende>
        <img src={StetoskopIkonBakgrunn} alt="Stetoskopikon for behandler" />
      </StyledImageWrapper>
      <StyledInnhold>
        <MeldingInnholdPanel melding={melding} />
        {showReturLegeerklaring && <ReturLegeerklaring melding={melding} />}
      </StyledInnhold>
    </StyledMelding>
  );
};

const MeldingTilBehandler = ({ melding }: MeldingInnholdProps) => {
  return (
    <StyledMelding>
      <StyledInnhold>
        <MeldingInnholdPanel melding={melding} />
        {melding.status?.type === MeldingStatusType.AVVIST && (
          <AvvistMelding meldingUuid={melding.uuid} />
        )}
        <PaminnelseMelding melding={melding} />
      </StyledInnhold>
      <StyledImageWrapper>
        <img src={NavLogoRod} alt="Rød NAV-logo" />
      </StyledImageWrapper>
    </StyledMelding>
  );
};

interface MeldingerISamtaleProps {
  meldinger: MeldingDTO[];
}

export const MeldingerISamtale = ({ meldinger }: MeldingerISamtaleProps) => {
  return (
    <StyledWrapper>
      {meldinger.map((melding: MeldingDTO, index: number) => {
        return melding.innkommende ? (
          <MeldingFraBehandler
            meldinger={meldinger}
            melding={melding}
            key={index}
          />
        ) : (
          <MeldingTilBehandler melding={melding} key={index} />
        );
      })}
    </StyledWrapper>
  );
};
