import React from "react";
import { TextField } from "@navikt/ds-react";

const texts = {
  label: "Oppgi virksomhetsnummer",
};

interface VirksomhetInputProps {
  velgVirksomhet(virksomhetsnummer: string): void;
}

export const VirksomhetInput = ({
  velgVirksomhet,
}: VirksomhetInputProps): React.ReactElement => (
  <TextField
    className="mt-4 max-w-xs"
    id="virksomhetInput"
    label={texts.label}
    size="small"
    onChange={(e) => {
      velgVirksomhet(e.target.value);
    }}
  />
);
