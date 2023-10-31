import React from "react";
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
import styled from "styled-components";

const texts = {
  header: "Historikk",
  subHeader: "Tidligere vurderinger av aktivitetskravet i Modia",
  arsakTitle: "Årsak",
  beskrivelseTitle: "Beskrivelse",
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

interface HistorikkElementProps {
  vurdering: AktivitetskravVurderingDTO;
}

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

const HistorikkElement = ({ vurdering }: HistorikkElementProps) => {
  const { data: veilederinfo } = useVeilederInfoQuery(vurdering.createdBy);
  const header = `${headerPrefix(vurdering.status)} - ${tilDatoMedManedNavn(
    vurdering.createdAt
  )}`;
  const arsak = vurdering.arsaker[0];

  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
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
        {veilederinfo?.navn}
      </Accordion.Content>
    </Accordion.Item>
  );
};

interface ParagraphProps {
  title: string;
  body: string;
}

const ParagraphWrapper = styled.div`
  padding-bottom: 1em;
`;

const Paragraph = ({ title, body }: ParagraphProps) => {
  return (
    <ParagraphWrapper>
      <b>{title}</b>
      <BodyLong size="small">{body}</BodyLong>
    </ParagraphWrapper>
  );
};
