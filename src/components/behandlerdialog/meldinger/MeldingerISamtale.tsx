import React from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import { MeldingInnholdPanel } from "@/components/behandlerdialog/meldinger/MeldingInnholdPanel";
import styled from "styled-components";
import {
  NavLogoRod,
  StetoskopIkonBakgrunn,
} from "../../../../img/ImageComponents";

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

const StyledMeldingInnhold = styled.div<{ innkommende?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => (props.innkommende ? "start" : "end")};
`;

interface MeldingInnholdProps {
  melding: Melding;
  skalHenteVedlegg: boolean;
}

const MeldingFraBehandler = ({
  melding,
  skalHenteVedlegg,
}: MeldingInnholdProps) => {
  return (
    <StyledMeldingInnhold innkommende>
      <StyledImageWrapper innkommende>
        <img src={StetoskopIkonBakgrunn} alt="Stetoskopikon for behandler" />
      </StyledImageWrapper>
      <MeldingInnholdPanel
        melding={melding}
        skalHenteVedlegg={skalHenteVedlegg}
      />
    </StyledMeldingInnhold>
  );
};

const MeldingTilBehandler = ({
  melding,
}: Pick<MeldingInnholdProps, "melding">) => {
  return (
    <StyledMeldingInnhold>
      <MeldingInnholdPanel melding={melding} skalHenteVedlegg={false} />
      <StyledImageWrapper>
        <img src={NavLogoRod} alt="Rød NAV-logo" />
      </StyledImageWrapper>
    </StyledMeldingInnhold>
  );
};

interface MeldingerISamtaleProps {
  meldinger: Melding[];
  skalHenteVedlegg: boolean;
}

export const MeldingerISamtale = ({
  meldinger,
  skalHenteVedlegg,
}: MeldingerISamtaleProps) => {
  return (
    <StyledWrapper>
      {meldinger.map((melding: Melding, index: number) => {
        return melding.innkommende ? (
          <MeldingFraBehandler
            melding={melding}
            skalHenteVedlegg={skalHenteVedlegg}
            key={index}
          />
        ) : (
          <MeldingTilBehandler melding={melding} key={index} />
        );
      })}
    </StyledWrapper>
  );
};
