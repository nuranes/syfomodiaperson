import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import { BehandlerdialogSide } from "@/components/behandlerdialog/BehandlerdialogSide";

const texts = {
  title: "Dialog med behandler",
};

export const BehandlerdialogContainer = (): ReactElement => {
  const henter = false;
  const hentingFeilet = false;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.BEHANDLERDIALOG}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <BehandlerdialogSide />
      </SideLaster>
    </Side>
  );
};
