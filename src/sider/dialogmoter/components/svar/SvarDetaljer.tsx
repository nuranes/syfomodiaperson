import { BodyLong, BodyShort, Label } from "@navikt/ds-react";
import React from "react";

const texts = {
  label: "Begrunnelse",
  harIkkeBegrunnelse: "Ingen detaljer er tilgjengelig.",
};

interface Props {
  label?: string;
  svarTekst: string | undefined;
}

export const SvarDetaljer = ({ label = texts.label, svarTekst }: Props) => {
  return svarTekst ? (
    <>
      <Label size="small">{label}</Label>
      <BodyLong size="small">{svarTekst}</BodyLong>
    </>
  ) : (
    <BodyShort size="small">{texts.harIkkeBegrunnelse}</BodyShort>
  );
};
