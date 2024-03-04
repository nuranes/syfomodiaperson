import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import { NotificationProvider } from "@/context/notification/NotificationContext";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { SendForhandsvarselSkjema } from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";

const texts = {
  title: "Arbeidsuførhet",
};

enum Status {
  NY = "NY",
  SENDT = "SENDT",
}

export const ArbeidsuforhetSide = (): ReactElement => {
  const status: Status = Status.NY;

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.ARBEIDSUFORHET}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={false} hentingFeilet={false}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <NotificationProvider>
              {status !== Status.NY ? (
                <ForhandsvarselSendt />
              ) : (
                <SendForhandsvarselSkjema />
              )}
            </NotificationProvider>
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <UtdragFraSykefravaeret />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
