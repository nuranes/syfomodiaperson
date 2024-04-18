import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { FattVedtak } from "@/sider/frisktilarbeid/FattVedtak";

const texts = {
  title: "Friskmelding til arbeidsformidling",
};

export const FriskmeldingTilArbeidsformidlingSide = (): ReactElement => {
  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.FRISKTILARBEID}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={false} hentingFeilet={false}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <FattVedtak />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            Her kommer historikk og link servicerutine
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
