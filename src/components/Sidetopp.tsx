import React from "react";
import { Heading } from "@navikt/ds-react";
import styled from "styled-components";

const StyledHeading = styled(Heading)`
  text-align: center;
`;

export const SIDETOPP_ID = "sidetopp";

interface SidetoppProps {
  tittel: string;
}

const Sidetopp = ({ tittel }: SidetoppProps) => {
  return (
    <header>
      <StyledHeading spacing size="xlarge" id={SIDETOPP_ID}>
        {tittel}
      </StyledHeading>
    </header>
  );
};

export default Sidetopp;
