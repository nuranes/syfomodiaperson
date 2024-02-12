import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import React from "react";
import { Radio } from "@navikt/ds-react";

interface VirksomhetRadioProps {
  velgVirksomhet(virksomhetsnummer: string): void;
  virksomhetsnummer: string;
}

export const VirksomhetRadio = ({
  velgVirksomhet,
  virksomhetsnummer,
}: VirksomhetRadioProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(virksomhetsnummer);
  const virksomhetsnavnText =
    virksomhetsnavn || `Fant ikke virksomhetsnavn for ${virksomhetsnummer}`;

  return (
    <Radio
      value={virksomhetsnummer}
      onChange={() => velgVirksomhet(virksomhetsnummer)}
    >
      {virksomhetsnavnText}
    </Radio>
  );
};
