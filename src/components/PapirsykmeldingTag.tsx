import React from "react";
import styled from "styled-components";
import { Tag } from "@navikt/ds-react";

const texts = {
  tag: "Papir",
};

const StyledTag = styled(Tag)`
  margin-left: 0.5em;
`;

export const PapirsykmeldingTag = () => (
  <StyledTag variant="neutral">{texts.tag}</StyledTag>
);
