import React, { ReactElement } from "react";
import Side from "../../../../sider/Side";
import DineSykmeldinger from "../sykmeldinger/DineSykmeldinger";
import Pengestopp from "../../../pengestopp/Pengestopp";
import SideLaster from "../../../SideLaster";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { Menypunkter } from "@/navigation/menypunkterTypes";
import { BistandsbehovOppgaver } from "@/components/speiling/sykmeldinger/VurderBistandsbehov";
import { Heading } from "@navikt/ds-react";
import styled from "styled-components";

const StyledHeading = styled(Heading)`
  text-align: center;
  margin: 1em 0 0.5em 0;
`;

const SykmeldingerSide = (): ReactElement => {
  const { isLoading, isError, sykmeldinger } = useSykmeldingerQuery();

  return (
    <Side tittel="Sykmeldinger" aktivtMenypunkt={Menypunkter.SYKMELDINGER}>
      <SideLaster henter={isLoading} hentingFeilet={isError}>
        <div>
          <Pengestopp sykmeldinger={sykmeldinger} />
          <BistandsbehovOppgaver />
          <StyledHeading size="xlarge">Sykmeldinger</StyledHeading>
          <DineSykmeldinger sykmeldinger={sykmeldinger} />
        </div>
      </SideLaster>
    </Side>
  );
};

export default SykmeldingerSide;
