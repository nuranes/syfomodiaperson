import React from "react";
import styled from "styled-components";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import {
  sykmeldingerMedStatusSendt,
  sykmeldingerSortertNyestTilEldst,
} from "@/utils/sykmeldinger/sykmeldingUtils";
import { Tooltip } from "@navikt/ds-react";
import { HealthCase } from "@navikt/ds-icons";

const texts = {
  tooltip: "Siste kjente diagnosekode",
};

const DiagnosekodeWrapper = styled.div`
  align-self: end;
  margin-left: 1em;
`;

const KodeSpan = styled.span`
  margin-left: 0.5em;
`;

export const Diagnosekode = () => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const sentSykmeldinger = sykmeldingerMedStatusSendt(sykmeldinger);
  const sortedSykmeldinger = sykmeldingerSortertNyestTilEldst(sentSykmeldinger);
  const latestSykmelding = sortedSykmeldinger[0];

  return (
    <DiagnosekodeWrapper>
      <Tooltip content={texts.tooltip}>
        <div>
          <HealthCase />
          <KodeSpan>
            {latestSykmelding?.diagnose?.hoveddiagnose?.diagnosekode}
          </KodeSpan>
        </div>
      </Tooltip>
    </DiagnosekodeWrapper>
  );
};
