import React from "react";
import { Heading } from "@navikt/ds-react";
import { Samtaler } from "@/components/behandlerdialog/meldinger/Samtaler";
import BehandleBehandlerdialogSvarOppgaveKnapp from "@/components/behandlerdialog/meldinger/BehandleBehandlerdialogSvarOppgaveKnapp";

export const texts = {
  header: "Meldinger",
};

export const Meldinger = () => {
  return (
    <>
      <Heading level="1" size="large" spacing>
        {texts.header}
      </Heading>
      <BehandleBehandlerdialogSvarOppgaveKnapp />
      <Samtaler />
    </>
  );
};
