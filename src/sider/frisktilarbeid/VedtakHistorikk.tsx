import { Box, Heading } from "@navikt/ds-react";
import React from "react";

const texts = {
  header: "Historikk § 8-5",
};

export const VedtakHistorikk = () => {
  return (
    <Box background="surface-default" padding="6">
      <Heading level="2" size="medium">
        {texts.header}
      </Heading>
      Her kommer historikk
    </Box>
  );
};
