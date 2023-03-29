import { DialogmotePanel } from "../../mote/components/DialogmotePanel";
import { FortidenImage } from "../../../../img/ImageComponents";
import { FlexRow } from "../../Layout";
import React, { ReactElement, useState } from "react";
import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { Forhandsvisning } from "../../Forhandsvisning";
import { useDialogmoteReferat } from "@/hooks/dialogmote/useDialogmoteReferat";
import styled from "styled-components";
import { UnntakDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { MoteHistorikkUnntak } from "@/components/dialogmote/motehistorikk/MoteHistorikkUnntak";
import { Flatknapp } from "nav-frontend-knapper";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";

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
        data-cy={title}
        mini
        kompakt
        htmlType="button"
        onClick={() => {
          setModalIsOpen(true);
        }}
      >
        {children}
      </Flatknapp>
      <Forhandsvisning
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
  if (historiskeMoter.length === 0 && dialogmoteunntak.length === 0)
    return <></>;

  return (
    <DialogmotePanel
      icon={FortidenImage}
      header={texts.header}
      subtitle={texts.subtitle}
    >
      {historiskeMoter.map((mote, index) => (
        <MoteHistorikk key={index} mote={mote} />
      ))}
      {dialogmoteunntak.map((unntak, index) => (
        <MoteHistorikkUnntak key={index} unntak={unntak} />
      ))}
    </DialogmotePanel>
  );
};
