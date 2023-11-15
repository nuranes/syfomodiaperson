import React from "react";
import styled from "styled-components";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { sykmeldingerSortertNyestTilEldst } from "@/utils/sykmeldinger/sykmeldingUtils";
import { Tooltip } from "@navikt/ds-react";
import { HealthCase } from "@navikt/ds-icons";

const texts = {
  tooltip: "Siste kjente diagnosekode",
};

const DiagnosekodeWrapper = styled.div`
  align-self: end;
`;

const KodeSpan = styled.span`
  margin-left: 0.5em;
`;

export const Diagnosekode = () => {
  const { sykmeldinger } = useSykmeldingerQuery();
  const sortedSykmeldinger = sykmeldingerSortertNyestTilEldst(sykmeldinger);
  const latestSykmelding = sortedSykmeldinger[0];
  const diagnosekode = latestSykmelding?.diagnose?.hoveddiagnose?.diagnosekode;

  return !!diagnosekode ? (
    <DiagnosekodeWrapper>
      <Tooltip content={texts.tooltip}>
        <div>
          <HealthCase />
          <KodeSpan>{diagnosekode}</KodeSpan>
        </div>
      </Tooltip>
    </DiagnosekodeWrapper>
  ) : null;
};
