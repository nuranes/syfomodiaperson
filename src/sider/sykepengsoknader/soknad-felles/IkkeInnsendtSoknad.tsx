import React, { ReactElement } from "react";
import TilbakeTilSoknader from "./TilbakeTilSoknader";
import { Box, Heading } from "@navikt/ds-react";

const texts = {
  title: "Søknaden er ikke sendt ennå",
  content:
    "Når brukeren har fullført søknaden og sendt den inn til arbeidsgiver og/eller NAV vil du kunne se statusen på søknaden her.",
};

const IkkeInnsendtSoknad = (): ReactElement => (
  <>
    <Box background="surface-default" className="mb-4 text-center" padding="6">
      <Heading size="small" level="2" className="mt-8">
        {texts.title}
      </Heading>
      <hr className="bg-amber-500/75 w-8 h-px border-0" />
      <p>{texts.content}</p>
    </Box>
    <TilbakeTilSoknader />
  </>
);

export default IkkeInnsendtSoknad;
