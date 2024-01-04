import React from "react";
import { Box } from "@navikt/ds-react";

interface SpeilingvarselProps {
  brukernavn: string;
}

const Speilingvarsel = ({ brukernavn }: SpeilingvarselProps) => (
  <Box background="surface-default" padding="3" className="mb-6">
    <p>
      Dette er slik <strong>{brukernavn}</strong> ser det på nav.no
    </p>
  </Box>
);

export default Speilingvarsel;
