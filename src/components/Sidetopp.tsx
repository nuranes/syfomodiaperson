import React from "react";
import { Heading } from "@navikt/ds-react";

const SIDETOPP_ID = "sidetopp";

interface Props {
  tittel: string;
}

const Sidetopp = ({ tittel }: Props) => {
  return (
    <header>
      <Heading spacing size="xlarge" id={SIDETOPP_ID} className="text-center">
        {tittel}
      </Heading>
    </header>
  );
};

export default Sidetopp;
