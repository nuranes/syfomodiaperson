import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { SendForhandsvarselSkjema } from "@/sider/arbeidsuforhet/SendForhandsvarselSkjema";
import { ForhandsvarselSendt } from "@/sider/arbeidsuforhet/ForhandsvarselSendt";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { VurderingHistorikk } from "@/sider/arbeidsuforhet/historikk/VurderingHistorikk";

const texts = {
  title: "Forhåndsvarsel §8-4",
};

export const ArbeidsuforhetSide = (): ReactElement => {
  const { data, isLoading, isError } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.ARBEIDSUFORHET}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <div className="mb-4">
              {!!sisteVurdering &&
              sisteVurdering.type === VurderingType.FORHANDSVARSEL ? (
                <ForhandsvarselSendt />
              ) : (
                <SendForhandsvarselSkjema />
              )}
            </div>
            <VurderingHistorikk />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            <UtdragFraSykefravaeret />
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
