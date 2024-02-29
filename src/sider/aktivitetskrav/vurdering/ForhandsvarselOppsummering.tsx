import React from "react";
import { AktivitetskravVarselDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BodyShort, Heading, Panel, Tag } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { VisBrev } from "@/components/VisBrev";
import { ExpandableBlockquote } from "@/components/ExpandableBlockquote";

const texts = {
  title: "Oppsummering av forhåndsvarselet",
  merInfo: "Husk å sjekke Gosys og Modia for mer informasjon før du vurderer. ",
};

interface ForhandsvarselOppsummeringProps {
  varsel: AktivitetskravVarselDTO;
  beskrivelse: string | undefined;
}

export const ForhandsvarselOppsummering = ({
  varsel,
  beskrivelse,
}: ForhandsvarselOppsummeringProps) => {
  const fristDato = tilLesbarDatoMedArUtenManedNavn(varsel.svarfrist);

  return (
    <Panel className="flex flex-col mb-4 gap-4 px-8">
      <div className="flex flex-row justify-between items-center">
        <Heading size="small" level="3">
          {texts.title}
        </Heading>
        <Tag variant="warning-moderate">{`Frist: ${fristDato}`}</Tag>
      </div>
      {beskrivelse && (
        <ExpandableBlockquote className="border-gray-400 rounded p-4">
          {beskrivelse}
        </ExpandableBlockquote>
      )}
      <VisBrev document={varsel.document} />
      <BodyShort>{texts.merInfo}</BodyShort>
    </Panel>
  );
};
