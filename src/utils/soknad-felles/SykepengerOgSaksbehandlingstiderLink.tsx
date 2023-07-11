import React from "react";
import styled from "styled-components";
import { BodyShort } from "@navikt/ds-react";

const StyledWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const StyledText = styled(BodyShort)`
  margin-right: 0.25em;
`;

interface SykepengerOgSaksbehandlingstiderLink {
  tittel?: string;
}

const SykepengerOgSaksbehandlingstiderLink = ({
  tittel,
}: SykepengerOgSaksbehandlingstiderLink) => {
  return (
    <StyledWrapper>
      {tittel && <StyledText size="small">{tittel}</StyledText>}
      <a
        href="https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Utbetalinger/Utbetalinger/Utbetalingsdatoer%2C+feriepenger+og+skattetrekk?kap=499628"
        target="_blank"
        rel="noreferrer"
      >
        Les om sykepenger og saksbehandlingstider.
      </a>
    </StyledWrapper>
  );
};

export default SykepengerOgSaksbehandlingstiderLink;
