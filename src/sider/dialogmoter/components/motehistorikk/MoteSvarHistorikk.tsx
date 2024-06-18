import {
  DialogmoteDTO,
  DialogmoteStatus,
  MotedeltakerVarselType,
} from "@/data/dialogmote/types/dialogmoteTypes";
import { FortidenImage } from "../../../../../img/ImageComponents";
import { Accordion, BodyLong, Box, Heading, Label } from "@navikt/ds-react";
import React, { useState } from "react";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { DialogmoteVeilederInfo } from "@/sider/dialogmoter/components/DialogmoteVeilederInfo";
import { DialogmoteStedInfo } from "@/sider/dialogmoter/components/DialogmoteStedInfo";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { ArbeidsgiverSvar } from "@/sider/dialogmoter/components/svar/ArbeidsgiverSvar";
import { ArbeidstakerSvar } from "@/sider/dialogmoter/components/svar/ArbeidstakerSvar";
import { BehandlerSvar } from "@/sider/dialogmoter/components/svar/BehandlerSvar";

const texts = {
  header: "Møtesvarhistorikk",
  subtitle: "Oversikt over svar på tidligere innkallinger til dialogmøter",
};

const getHeaderText = (mote: DialogmoteDTO): string => {
  const moteDato = tilDatoMedManedNavn(mote.tid);
  switch (mote.status) {
    case DialogmoteStatus.AVLYST:
      return `Avlyst møte ${moteDato}`;
    case DialogmoteStatus.FERDIGSTILT:
      return `Møte ${moteDato}`;
    default:
      return "";
  }
};

interface MoteSvarHistorikkItemProps {
  dialogmote: DialogmoteDTO;
}

const MoteSvarHistorikkItem = ({ dialogmote }: MoteSvarHistorikkItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccordionClick = () => {
    if (!isOpen) {
      Amplitude.logEvent({
        type: EventType.AccordionOpen,
        data: {
          tekst: `Åpne møtesvar-historikk accordion`,
          url: window.location.href,
        },
      });
    }
    setIsOpen(!isOpen);
  };

  const innkallingArbeidstaker = dialogmote.arbeidstaker.varselList.find(
    ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
  );
  const innkallingArbeidsgiver = dialogmote.arbeidsgiver.varselList.find(
    ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
  );
  const innkallingBehandler =
    dialogmote.behandler &&
    dialogmote.behandler.varselList.find(
      ({ varselType }) => varselType === MotedeltakerVarselType.INNKALT
    );

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {getHeaderText(dialogmote)}
      </Accordion.Header>
      <Accordion.Content>
        <DialogmoteStedInfo dialogmote={dialogmote} />
        <DialogmoteVeilederInfo dialogmote={dialogmote} />
        <div className="mt-4">
          <Label size="small">{`Innkalling sendt ${tilDatoMedManedNavn(
            dialogmote.createdAt
          )} - svar:`}</Label>
          <div className="flex flex-col gap-4">
            {innkallingArbeidsgiver && (
              <ArbeidsgiverSvar
                varsel={innkallingArbeidsgiver}
                virksomhetsnummer={dialogmote.arbeidsgiver.virksomhetsnummer}
                defaultClosed
              />
            )}
            {innkallingArbeidstaker && (
              <ArbeidstakerSvar varsel={innkallingArbeidstaker} defaultClosed />
            )}
            {innkallingBehandler && (
              <BehandlerSvar
                varsel={innkallingBehandler}
                behandlerNavn={dialogmote.behandler.behandlerNavn}
              />
            )}
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface MoteSvarHistorikkProps {
  historiskeMoter: DialogmoteDTO[];
}

export const MoteSvarHistorikk = ({
  historiskeMoter,
}: MoteSvarHistorikkProps) => (
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
        <MoteSvarHistorikkItem dialogmote={mote} key={index} />
      ))}
    </Accordion>
  </Box>
);
