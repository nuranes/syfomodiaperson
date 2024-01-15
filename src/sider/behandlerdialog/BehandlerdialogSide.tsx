import React from "react";
import { MeldingTilBehandler } from "@/sider/behandlerdialog/meldingtilbehandler/MeldingTilBehandler";
import styled from "styled-components";
import { Panel } from "@navikt/ds-react";
import { Meldinger } from "@/sider/behandlerdialog/meldinger/Meldinger";

export const BehandlerdialogPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  padding: 2em;
  margin-bottom: 1em;
`;

export const BehandlerdialogSide = () => {
  return (
    <>
      <BehandlerdialogPanel>
        <MeldingTilBehandler />
      </BehandlerdialogPanel>
      <BehandlerdialogPanel>
        <Meldinger />
      </BehandlerdialogPanel>
    </>
  );
};
