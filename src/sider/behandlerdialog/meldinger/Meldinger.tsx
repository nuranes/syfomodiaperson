import React from "react";
import { Heading } from "@navikt/ds-react";
import { Samtaler } from "@/sider/behandlerdialog/meldinger/Samtaler";
import BehandleBehandlerdialogSvarOppgaveKnapp from "@/sider/behandlerdialog/meldinger/BehandleBehandlerdialogSvarOppgaveKnapp";

export const texts = {
  header: "Meldinger",
};

export const Meldinger = () => {
  return (
    <>
      <Heading level="2" size="medium" spacing>
        {texts.header}
      </Heading>
      <BehandleBehandlerdialogSvarOppgaveKnapp />
      <Samtaler />
    </>
  );
};
