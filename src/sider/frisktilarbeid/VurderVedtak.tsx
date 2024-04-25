import React, { ReactElement } from "react";
import { Box, Button } from "@navikt/ds-react";
import { VedtakForberedelser } from "@/sider/frisktilarbeid/VedtakForberedelser";

const texts = {
  button: "Vurder vedtak",
};

interface VurderVedtakProps {
  onClick: () => void;
}

export const VurderVedtak = ({ onClick }: VurderVedtakProps): ReactElement => (
  <Box background="surface-default" padding="6" className="flex flex-col gap-4">
    <VedtakForberedelser />
    <Button className="mt-4 w-fit" onClick={onClick}>
      {texts.button}
    </Button>
  </Box>
);
