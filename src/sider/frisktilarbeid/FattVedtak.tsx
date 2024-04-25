import { Box } from "@navikt/ds-react";
import React from "react";
import { VedtakForberedelser } from "@/sider/frisktilarbeid/VedtakForberedelser";
import { FattVedtakSkjema } from "@/sider/frisktilarbeid/FattVedtakSkjema";

export const FattVedtak = () => (
  <>
    <Box background="surface-default" padding="6">
      <VedtakForberedelser />
    </Box>
    <FattVedtakSkjema />
  </>
);
