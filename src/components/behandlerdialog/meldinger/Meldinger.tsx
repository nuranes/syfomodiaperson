import React from "react";
import { Heading } from "@navikt/ds-react";
import { Samtaler } from "@/components/behandlerdialog/meldinger/Samtaler";

export const texts = {
  header: "Meldinger",
};

export const Meldinger = () => {
  return (
    <>
      <Heading level="1" size="large">
        {texts.header}
      </Heading>
      <Samtaler />
    </>
  );
};
