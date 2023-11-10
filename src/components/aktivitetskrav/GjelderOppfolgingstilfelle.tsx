import { BodyShort } from "@navikt/ds-react";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import React from "react";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";

interface GjelderOppfolgingstilfelleProps {
  oppfolgingstilfelle: OppfolgingstilfelleDTO;
}

export const GjelderOppfolgingstilfelle = ({
  oppfolgingstilfelle,
}: GjelderOppfolgingstilfelleProps) => {
  return (
    <BodyShort className="mb-4">{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
      oppfolgingstilfelle.start,
      oppfolgingstilfelle.end
    )}`}</BodyShort>
  );
};
