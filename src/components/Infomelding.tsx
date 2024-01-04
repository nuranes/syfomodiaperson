import React from "react";
import { Box, Heading } from "@navikt/ds-react";

interface InfomeldingProps {
  tittel: string;
  melding: string;
}

const Infomelding = (infomeldingProps: InfomeldingProps) => {
  const { tittel, melding } = infomeldingProps;
  return (
    <Box background="surface-default" className="text-center" padding="6">
      <Heading size="small" level="3" className="mt-8">
        {tittel}
      </Heading>
      <hr className="bg-amber-500/75 w-8 h-px border-0 my-4" />
      <p>{melding}</p>
    </Box>
  );
};

export default Infomelding;
