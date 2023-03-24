import React from "react";
import { SkrivTilBehandlerSkjema } from "@/components/behandlerdialog/skrivtilbehandler/SkrivTilBehandlerSkjema";
import { Heading } from "@navikt/ds-react";

export const texts = {
  header: "Skriv til behandler",
};

export const SkrivTilBehandler = () => {
  return (
    <>
      <Heading level={"1"} size={"large"}>
        {texts.header}
      </Heading>
      <SkrivTilBehandlerSkjema />
    </>
  );
};
