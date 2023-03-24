import React from "react";
import { MeldingTilBehandlerSkjema } from "@/components/behandlerdialog/meldingtilbehandler/MeldingTilBehandlerSkjema";
import { Heading } from "@navikt/ds-react";

export const texts = {
  header: "Skriv til behandler",
};

export const MeldingTilBehandler = () => {
  return (
    <>
      <Heading level={"1"} size={"large"}>
        {texts.header}
      </Heading>
      <MeldingTilBehandlerSkjema />
    </>
  );
};
