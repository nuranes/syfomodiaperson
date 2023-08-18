import React from "react";
import { Heading } from "@navikt/ds-react";
import styled from "styled-components";

interface SidetoppProps {
  tittel: string;
}

const StyledHeading = styled(Heading)`
  text-align: center;
`;
const Sidetopp = ({ tittel }: SidetoppProps) => {
  return (
    <header>
      <StyledHeading spacing size="xlarge">
        {tittel}
      </StyledHeading>
    </header>
  );
};

export default Sidetopp;
