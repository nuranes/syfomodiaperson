import React, { ReactElement } from "react";
import Side from "@/sider/Side";
import Sidetopp from "@/components/Sidetopp";
import SideLaster from "@/components/SideLaster";
import * as Tredelt from "@/sider/TredeltSide";
import { Menypunkter } from "@/components/globalnavigasjon/GlobalNavigasjon";
import { useVedtakQuery } from "@/data/frisktilarbeid/vedtakQuery";
import { FriskmeldingTilArbeidsformidling } from "@/sider/frisktilarbeid/FriskmeldingTilArbeidsformidling";

const texts = {
  title: "Friskmelding til arbeidsformidling",
};

export const FriskmeldingTilArbeidsformidlingSide = (): ReactElement => {
  const { isLoading, isError } = useVedtakQuery();

  return (
    <Side tittel={texts.title} aktivtMenypunkt={Menypunkter.FRISKTILARBEID}>
      <Sidetopp tittel={texts.title} />
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <Tredelt.Container>
          <Tredelt.FirstColumn>
            <FriskmeldingTilArbeidsformidling />
          </Tredelt.FirstColumn>
          <Tredelt.SecondColumn>
            Her kommer historikk og link servicerutine
          </Tredelt.SecondColumn>
        </Tredelt.Container>
      </SideLaster>
    </Side>
  );
};
