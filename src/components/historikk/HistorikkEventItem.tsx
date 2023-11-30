import React, { ReactElement } from "react";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import OppfolgingsplanIkon from "../../ikoner/OppfolgingsplanIkon";
import MoteIkon from "../../ikoner/MoteIkon";
import LederIkon from "../../ikoner/LederIkon";
import styled from "styled-components";
import { Normaltekst } from "nav-frontend-typografi";
import navFarger from "nav-frontend-core";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import { PersonIcon } from "@navikt/aksel-icons";

const hentIkon = (event: HistorikkEvent) => {
  switch (event.kilde) {
    case "MOTER":
    case "MOTEBEHOV": {
      return <MoteIkon />;
    }
    case "OPPFOLGINGSPLAN": {
      return <OppfolgingsplanIkon />;
    }
    case "LEDER": {
      return <LederIkon />;
    }
    case "AKTIVITETSKRAV":
      return <PersonIcon />;
    default: {
      return null;
    }
  }
};

const HistorikkEventListItem = styled.li`
  border-bottom: 1px solid ${navFarger.navGra40};
  padding: 1.5em 0;
  display: block;

  &:last-child {
    border-bottom: 0;
  }
`;

const HistorikkEventInfo = styled.div`
  display: flex;
`;

const HistorikkIkonWrapper = styled.div`
  display: flex;
  align-self: center;
  margin-right: 10px;
`;

interface HistorikkEventProps {
  event: HistorikkEvent;
}

const HistorikkEventItem = ({ event }: HistorikkEventProps): ReactElement => (
  <HistorikkEventListItem>
    <Normaltekst>{tilLesbarDatoMedArstall(event.tidspunkt)}</Normaltekst>
    <HistorikkEventInfo>
      <HistorikkIkonWrapper>{hentIkon(event)}</HistorikkIkonWrapper>
      <Normaltekst>{event.tekst}</Normaltekst>
    </HistorikkEventInfo>
  </HistorikkEventListItem>
);

export default HistorikkEventItem;
