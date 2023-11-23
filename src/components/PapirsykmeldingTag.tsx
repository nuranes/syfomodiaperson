import React from "react";
import { Tag } from "@navikt/ds-react";

const texts = {
  tag: "Papir",
};

export const PapirsykmeldingTag = () => (
  <Tag className="w-max" variant="neutral">
    {texts.tag}
  </Tag>
);
