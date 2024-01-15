import React, { useState } from "react";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
  VurderingArsak,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { FlexColumn, FlexRow, PaddingSize } from "@/components/Layout";
import {
  Accordion,
  BodyLong,
  BodyShort,
  Heading,
  Panel,
} from "@navikt/ds-react";
import { capitalizeWord } from "@/utils/stringUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  oppfyltVurderingArsakTexts,
  unntakVurderingArsakTexts,
} from "@/data/aktivitetskrav/aktivitetskravTexts";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import { VarselBrev } from "@/sider/aktivitetskrav/VarselBrev";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere vurderinger av aktivitetskravet i Modia",
  arsakTitle: "Årsak",
  beskrivelseTitle: "Begrunnelse",
  visBrev: "Se hele brevet",
  visBrevLabel: "Vis brevet",
  vurdertAv: "Vurdert av",
};

const isRelevantForHistorikk = (vurdering: AktivitetskravVurderingDTO) =>
  vurdering.status === AktivitetskravStatus.OPPFYLT ||
  vurdering.status === AktivitetskravStatus.UNNTAK ||
  vurdering.status === AktivitetskravStatus.STANS ||
  vurdering.status === AktivitetskravStatus.IKKE_OPPFYLT ||
  vurdering.status === AktivitetskravStatus.FORHANDSVARSEL;

const byCreatedAt = (
  v1: AktivitetskravVurderingDTO,
  v2: AktivitetskravVurderingDTO
) => new Date(v2.createdAt).getTime() - new Date(v1.createdAt).getTime();

export const AktivitetskravHistorikk = () => {
  const { data } = useAktivitetskravQuery();
  const vurderinger = data.flatMap((aktivitetskrav) =>
    aktivitetskrav.vurderinger.filter(isRelevantForHistorikk)
  );

  return (
    <Panel className="mb-4 flex flex-col p-8">
      <FlexRow bottomPadding={PaddingSize.MD}>
        <FlexColumn>
          <Heading level="2" size="large">
            {texts.header}
          </Heading>
          <BodyShort size="small">{texts.subHeader}</BodyShort>
        </FlexColumn>
      </FlexRow>
      <Accordion>
        {vurderinger.sort(byCreatedAt).map((vurdering, index) => (
          <HistorikkElement key={index} vurdering={vurdering} />
        ))}
      </Accordion>
    </Panel>
  );
};

const headerPrefix = (status: AktivitetskravStatus): string => {
  switch (status) {
    case AktivitetskravStatus.OPPFYLT:
    case AktivitetskravStatus.UNNTAK: {
      return capitalizeWord(status);
    }
    case AktivitetskravStatus.STANS: {
      return "Innstilling om stopp";
    }
    case AktivitetskravStatus.IKKE_OPPFYLT: {
      return "Ikke oppfylt";
    }
    case AktivitetskravStatus.FORHANDSVARSEL: {
      return "Forhåndsvarsel";
    }
    case AktivitetskravStatus.NY:
    case AktivitetskravStatus.NY_VURDERING:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
    case AktivitetskravStatus.AVVENT:
    case AktivitetskravStatus.LUKKET:
    case AktivitetskravStatus.IKKE_AKTUELL: {
      // Ikke relevant for historikk
      return "";
    }
  }
};

const getArsakText = (arsak: VurderingArsak) => {
  return (
    oppfyltVurderingArsakTexts[arsak] ||
    unntakVurderingArsakTexts[arsak] ||
    arsak
  );
};

interface HistorikkElementProps {
  vurdering: AktivitetskravVurderingDTO;
}

const HistorikkElement = ({ vurdering }: HistorikkElementProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: veilederinfo } = useVeilederInfoQuery(vurdering.createdBy);
  const header = `${headerPrefix(vurdering.status)} - ${tilDatoMedManedNavn(
    vurdering.createdAt
  )}`;
  const arsak = vurdering.arsaker[0];

  const handleAccordionClick = () => {
    if (!isOpen) {
      // Vil bare logge klikk som åpner accordion
      Amplitude.logEvent({
        type: EventType.AccordionOpen,
        data: {
          tekst: `Åpne accordion aktivitetskrav historikk: ${header}`,
          url: window.location.href,
        },
      });
    }
    setIsOpen(!isOpen);
  };

  return (
    <Accordion.Item open={isOpen}>
      <Accordion.Header onClick={handleAccordionClick}>
        {header}
      </Accordion.Header>
      <Accordion.Content>
        {!!arsak && (
          <Paragraph title={texts.arsakTitle} body={getArsakText(arsak)} />
        )}
        {!!vurdering.beskrivelse && (
          <Paragraph
            title={texts.beskrivelseTitle}
            body={vurdering.beskrivelse}
          />
        )}
        <Paragraph title={texts.vurdertAv} body={veilederinfo?.navn ?? ""} />
        {vurdering.status === AktivitetskravStatus.FORHANDSVARSEL &&
          vurdering.varsel?.document && (
            <VarselBrev varsel={vurdering.varsel} />
          )}
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface ParagraphProps {
  title: string;
  body: string;
}

const Paragraph = ({ title, body }: ParagraphProps) => {
  return (
    <div className="mb-4">
      <b>{title}</b>
      <BodyLong size="small">{body}</BodyLong>
    </div>
  );
};
