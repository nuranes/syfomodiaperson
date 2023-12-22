import { FortidenImage } from "../../../../img/ImageComponents";
import { FlexRow } from "../../Layout";
import React, { ReactElement, useState } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { ForhandsvisningModal } from "../../ForhandsvisningModal";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import styled from "styled-components";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { MoteHistorikkUnntak } from "@/components/dialogmote/motehistorikk/MoteHistorikkUnntak";
import { Flatknapp } from "nav-frontend-knapper";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { BodyLong, Box, Heading } from "@navikt/ds-react";

const texts = {
  header: "Møtehistorikk",
  subtitle:
    "Oversikt over tidligere dialogmøter som ble innkalt i Modia (inkluderer ikke historikk fra Arena).",
  avlystMote: "Avlysning av møte",
  avholdtMote: "Referat fra møte",
  referat: "Referat",
  avlysningsBrev: "Avlysningsbrev",
};

const ButtonRow = styled(FlexRow)`
  padding-bottom: 0.5em;
`;

interface ForhandsvisDocumentButtonRowProps {
  document: DocumentComponentDto[];
  title: string;
  children: string;
}

export const ForhandsvisDocumentButtonRow = ({
  document,
  title,
  children,
}: ForhandsvisDocumentButtonRowProps): ReactElement => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  return (
    <ButtonRow>
      <Flatknapp
        mini
        kompakt
        htmlType="button"
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        {children}
      </Flatknapp>
      <ForhandsvisningModal
        title={title}
        contentLabel={title}
        isOpen={modalIsOpen}
        handleClose={() => setModalIsOpen(false)}
        getDocumentComponents={() => document}
      />
    </ButtonRow>
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
      <ForhandsvisDocumentButtonRow
        document={document}
        title={texts.avlysningsBrev}
      >
        {`${texts.avlystMote} ${moteDatoTekst}`}
      </ForhandsvisDocumentButtonRow>
    );
  }

  return (
    <>
      {ferdigstilteReferat.map((referat, index) => {
        const suffix = referat.endring
          ? ` - Endret ${tilDatoMedManedNavn(referat.updatedAt)}`
          : "";

        return (
          <ForhandsvisDocumentButtonRow
            key={index}
            document={referat.document}
            title={texts.referat}
          >
            {`${texts.avholdtMote} ${moteDatoTekst}${suffix}`}
          </ForhandsvisDocumentButtonRow>
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
      {historiskeMoter.map((mote, index) => (
        <MoteHistorikk key={index} mote={mote} />
      ))}
      {dialogmoteunntak.map((unntak, index) => (
        <MoteHistorikkUnntak key={index} unntak={unntak} />
      ))}
    </Box>
  );
};
