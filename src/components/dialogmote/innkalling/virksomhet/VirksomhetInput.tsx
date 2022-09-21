import React from "react";
import styled from "styled-components";
import { Input } from "nav-frontend-skjema";

const texts = {
  label: "Oppgi virksomhetsnummer",
};

const StyledInput = styled(Input)`
  margin-top: 1em;
`;

interface VirksomhetInputProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  id: string;
}

export const VirksomhetInput = ({
  velgVirksomhet,
  id,
}: VirksomhetInputProps): React.ReactElement => {
  return (
    <StyledInput
      id={id}
      label={texts.label}
      onChange={(e) => {
        velgVirksomhet(e.target.value);
      }}
      bredde={"M"}
    />
  );
};
