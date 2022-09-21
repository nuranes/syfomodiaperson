import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { Radio } from "nav-frontend-skjema";
import React from "react";

interface VirksomhetRadioProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  virksomhetsnummer: string;
  name: string;
}

export const VirksomhetRadio = ({
  velgVirksomhet,
  virksomhetsnummer,
  name,
}: VirksomhetRadioProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);
  const virksomhetsnavnText =
    virksomhetsnavn || `Fant ikke virksomhetsnavn for ${virksomhetsnummer}`;

  return (
    <Radio
      label={virksomhetsnavnText}
      name={name}
      value={virksomhetsnummer}
      onChange={() => velgVirksomhet(virksomhetsnummer)}
    />
  );
};
