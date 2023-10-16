import React, { ReactElement } from "react";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { ForhandsvisDocumentButtonRow } from "@/components/dialogmote/motehistorikk/MotehistorikkPanel";

import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { unntakArsakTexts } from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";

const texts = {
  unntakTitle: "Unntak fra dialogmøte",
  unntakLenke: "Unntak fra dialogmøte",
  arsakLabel: "Årsak til unntak",
  beskrivelseLabel: "Beskrivelse",
};

export const unntakLenkeText = (unntakCreatedAt: Date) => {
  const unntakDatoTekst = tilDatoMedManedNavn(unntakCreatedAt);
  return `${texts.unntakLenke} ${unntakDatoTekst}`;
};

const createUnntakDocument = (unntak: UnntakDTO): DocumentComponentDto[] => {
  const arsakText: string =
    unntakArsakTexts.find(
      (unntakArsakText) => unntakArsakText.arsak == unntak.arsak
    )?.text || unntak.arsak;
  const componentList = [
    {
      type: DocumentComponentType.PARAGRAPH,
      key: unntak.arsak,
      title: texts.arsakLabel,
      texts: [arsakText],
    },
  ];
  if (unntak.beskrivelse) {
    return [
      ...componentList,
      {
        type: DocumentComponentType.PARAGRAPH,
        title: texts.beskrivelseLabel,
        texts: [unntak.beskrivelse],
      },
    ];
  }
  return componentList;
};

interface MoteHistorikkUnntakProps {
  unntak: UnntakDTO;
}

export const MoteHistorikkUnntak = ({
  unntak,
}: MoteHistorikkUnntakProps): ReactElement => {
  const unntakDocument = createUnntakDocument(unntak);
  return (
    <ForhandsvisDocumentButtonRow
      document={unntakDocument}
      title={texts.unntakTitle}
    >
      {unntakLenkeText(unntak.createdAt)}
    </ForhandsvisDocumentButtonRow>
  );
};
