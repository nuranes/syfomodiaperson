import { ExpansionCard } from "@navikt/ds-react";
import SykmeldingUtdragFraSykefravaretVisning from "@/components/motebehov/SykmeldingUtdragFraSykefravaretVisning";
import React from "react";
import { SykmeldingTittelbeskrivelse } from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import styled from "styled-components";

const StyledExpantionCardHeader = styled(ExpansionCard.Header)`
  .navds-expansioncard__header-content {
    width: 100%;
  }
`;

interface UtvidbarSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
  label?: string;
}

function logAccordionOpened(isOpen: boolean) {
  if (isOpen) {
    Amplitude.logEvent({
      type: EventType.AccordionOpen,
      data: {
        tekst: `Åpne sykmeldinger accordion`,
        url: window.location.href,
      },
    });
  }
}

export const UtvidbarSykmelding = ({
  sykmelding,
  label,
}: UtvidbarSykmeldingProps) => {
  const title = label ? label : "Sykmelding uten arbeidsgiver";
  return (
    <ExpansionCard aria-label={title} onToggle={logAccordionOpened}>
      <StyledExpantionCardHeader className="w-full">
        <ExpansionCard.Title
          as="div"
          className="flex justify-between m-0 text-base"
        >
          <SykmeldingTittelbeskrivelse sykmelding={sykmelding} />
        </ExpansionCard.Title>
      </StyledExpantionCardHeader>
      <ExpansionCard.Content>
        <SykmeldingUtdragFraSykefravaretVisning sykmelding={sykmelding} />
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};
