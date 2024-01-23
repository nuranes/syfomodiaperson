import React from "react";
import styled from "styled-components";
import { useSykmeldingerQuery } from "@/data/sykmelding/sykmeldingQueryHooks";
import { sykmeldingerSortertNyestTilEldstPeriode } from "@/utils/sykmeldinger/sykmeldingUtils";
import { Tooltip } from "@navikt/ds-react";
import { MedisinskrinImage } from "../../../../img/ImageComponents";

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
  const sortedSykmeldinger =
    sykmeldingerSortertNyestTilEldstPeriode(sykmeldinger);
  const latestSykmelding = sortedSykmeldinger[0];
  const diagnosekode = latestSykmelding?.diagnose?.hoveddiagnose?.diagnosekode;

  return !!diagnosekode ? (
    <DiagnosekodeWrapper>
      <Tooltip content={texts.tooltip}>
        <div>
          <img src={MedisinskrinImage} alt="Medisinskrin" />
          <KodeSpan>{diagnosekode}</KodeSpan>
        </div>
      </Tooltip>
    </DiagnosekodeWrapper>
  ) : null;
};
