import { FortidenImage } from "../../../../../img/ImageComponents";
import React, { ReactElement } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { MoteHistorikkUnntak } from "@/sider/dialogmoter/components/motehistorikk/MoteHistorikkUnntak";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { Accordion, BodyLong, Box, Heading } from "@navikt/ds-react";
import { DocumentComponentVisning } from "@/components/document/DocumentComponentVisning";

const texts = {
  header: "Møtehistorikk",
  subtitle:
    "Oversikt over tidligere dialogmøter som ble innkalt i Modia (inkluderer ikke historikk fra Arena).",
  avlystMote: "Avlysning av møte",
  avholdtMote: "Referat fra møte",
  referat: "Referat",
  avlysningsBrev: "Avlysningsbrev",
};

interface ForhandsvisDocumentAccordionItemProps {
  document: DocumentComponentDto[];
  children: string;
}

export const ForhandsvisDocumentAccordionItem = ({
  document,
  children,
}: ForhandsvisDocumentAccordionItemProps): ReactElement => {
  return (
    <Accordion.Item>
      <Accordion.Header>{children}</Accordion.Header>
      <Accordion.Content>
        {document.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface MoteHistorikkProps {
  mote: DialogmoteDTO;
}

const MoteHistorikk = ({ mote }: MoteHistorikkProps): ReactElement => {
  const isMoteAvlyst = mote.status === DialogmoteStatus.AVLYST;
  const { ferdigstilteReferat } = useDialogmoteReferat(mote);
  const moteDatoTekst = tilDatoMedManedNavn(mote.tid);

  if (isMoteAvlyst) {
    const document =
      mote.arbeidstaker.varselList.find(
        (varsel) => varsel.varselType === MotedeltakerVarselType.AVLYST
      )?.document || [];

    return (
      <ForhandsvisDocumentAccordionItem document={document}>
        {`${texts.avlystMote} ${moteDatoTekst}`}
      </ForhandsvisDocumentAccordionItem>
    );
  }

  return (
    <>
      {ferdigstilteReferat.map((referat, index) => {
        const suffix = referat.endring
          ? ` - Endret ${tilDatoMedManedNavn(referat.updatedAt)}`
          : "";

        return (
          <ForhandsvisDocumentAccordionItem
            key={index}
            document={referat.document}
          >
            {`${texts.avholdtMote} ${moteDatoTekst}${suffix}`}
          </ForhandsvisDocumentAccordionItem>
        );
      })}
    </>
  );
};

interface MotehistorikkPanelProps {
  dialogmoteunntak: UnntakDTO[];
  historiskeMoter: DialogmoteDTO[];
}

export const MotehistorikkPanel = ({
  dialogmoteunntak,
  historiskeMoter,
}: MotehistorikkPanelProps) => {
  return (
    <Box background="surface-default" className="p-8">
      <div className="flex flex-row mb-4">
        <img src={FortidenImage} alt="moteikon" className="w-12 mr-4" />
        <div className="flex flex-col">
          <Heading level="2" size="medium" className="">
            {texts.header}
          </Heading>
          <BodyLong size="small">{texts.subtitle}</BodyLong>
        </div>
      </div>
      <Accordion>
        {historiskeMoter.map((mote, index) => (
          <MoteHistorikk key={index} mote={mote} />
        ))}
        {dialogmoteunntak.map((unntak, index) => (
          <MoteHistorikkUnntak key={index} unntak={unntak} />
        ))}
      </Accordion>
    </Box>
  );
};
