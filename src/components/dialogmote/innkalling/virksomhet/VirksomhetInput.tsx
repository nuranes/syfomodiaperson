import React from "react";
import styled from "styled-components";
import { Input } from "nav-frontend-skjema";

const texts = {
  id: "virksomhetInput",
  label: "Oppgi virksomhetsnummer",
};

const StyledInput = styled(Input)`
  margin-top: 1em;
`;

interface VirksomhetInputProps {
  velgVirksomhet(virksomhetsnummer: string): void;
}

export const VirksomhetInput = ({
  velgVirksomhet,
}: VirksomhetInputProps): React.ReactElement => {
  return (
    <StyledInput
      id={texts.id}
      label={texts.label}
      onChange={(e) => {
        velgVirksomhet(e.target.value);
      }}
      bredde={"M"}
    />
  );
};
