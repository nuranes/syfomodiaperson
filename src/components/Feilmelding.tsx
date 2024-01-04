import React from "react";
import { BodyShort, Box, Heading } from "@navikt/ds-react";

interface FeilmeldingProps {
  tittel?: string;
  melding?: string;
}

const Feilmelding = ({
  tittel = "Beklager, det oppstod en feil",
  melding = "Vennligst prøv igjen litt senere.",
}: FeilmeldingProps) => (
  <Box background="surface-default" className="text-center" padding="6">
    <Heading size="medium" level="3" className="mt-8">
      {tittel}
    </Heading>
    <BodyShort size="small">{melding}</BodyShort>
  </Box>
);

export default Feilmelding;
