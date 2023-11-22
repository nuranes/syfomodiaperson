import { Heading } from "@navikt/ds-react";
import React from "react";

export const DocumentComponentHeaderH1 = ({ text }: { text: string }) => (
  <Heading className="py-4" size="large">
    {text}
  </Heading>
);
