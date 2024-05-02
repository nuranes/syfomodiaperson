import React from "react";
import { Heading } from "@navikt/ds-react";

const SIDETOPP_ID = "sidetopp";

interface Props {
  tittel: string;
}

const Sidetopp = ({ tittel }: Props) => {
  return (
    <header>
      <Heading spacing size="large" id={SIDETOPP_ID} level="1">
        {tittel}
      </Heading>
    </header>
  );
};

export default Sidetopp;
