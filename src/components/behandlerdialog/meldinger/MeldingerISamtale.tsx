import React from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { MeldingInnholdPanel } from "@/components/behandlerdialog/meldinger/MeldingInnholdPanel";
import styled from "styled-components";
import {
  NavLogoRod,
  StetoskopIkonBakgrunn,
} from "../../../../img/ImageComponents";
import { Alert } from "@navikt/ds-react";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import { PaminnelseMelding } from "@/components/behandlerdialog/paminnelse/PaminnelseMelding";

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

const MeldingFraBehandler = ({ melding }: MeldingInnholdProps) => {
  return (
    <StyledMelding innkommende>
      <StyledImageWrapper innkommende>
        <img src={StetoskopIkonBakgrunn} alt="Stetoskopikon for behandler" />
      </StyledImageWrapper>
      <StyledInnhold>
        <MeldingInnholdPanel melding={melding} />
      </StyledInnhold>
    </StyledMelding>
  );
};

const MeldingTilBehandler = ({ melding }: MeldingInnholdProps) => {
  const { isFeatureEnabled } = useFeatureToggles();
  const isPaminnelseEnabled = isFeatureEnabled(
    ToggleNames.behandlerdialogPaminnelse
  );

  return (
    <StyledMelding>
      <StyledInnhold>
        <MeldingInnholdPanel melding={melding} />
        {melding.status?.tekst && (
          <Alert variant="error">{melding.status?.tekst}</Alert>
        )}
        {isPaminnelseEnabled && <PaminnelseMelding melding={melding} />}
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
          <MeldingFraBehandler melding={melding} key={index} />
        ) : (
          <MeldingTilBehandler melding={melding} key={index} />
        );
      })}
    </StyledWrapper>
  );
};
