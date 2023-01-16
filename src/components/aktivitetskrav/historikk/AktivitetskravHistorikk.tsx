import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import React from "react";
import {
  AktivitetskravStatus,
  AktivitetskravVurderingDTO,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { FlexColumn, FlexRow, PaddingSize } from "@/components/Layout";
import { Innholdstittel, Normaltekst } from "nav-frontend-typografi";
import { Accordion } from "@navikt/ds-react";
import { capitalizeWord } from "@/utils/stringUtils";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";

const texts = {
  header: "Historikk",
  subHeader:
    "Tidligere behandling av aktivitetskravet som ble gjennomført i Modia.",
};

const isRelevantForHistorikk = (vurdering: AktivitetskravVurderingDTO) =>
  vurdering.status === AktivitetskravStatus.OPPFYLT ||
  vurdering.status === AktivitetskravStatus.UNNTAK ||
  vurdering.status === AktivitetskravStatus.STANS ||
  vurdering.status === AktivitetskravStatus.IKKE_OPPFYLT;

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
    <AktivitetskravPanel>
      <FlexRow bottomPadding={PaddingSize.MD}>
        <FlexColumn>
          <Innholdstittel>{texts.header}</Innholdstittel>
          <Normaltekst>{texts.subHeader}</Normaltekst>
        </FlexColumn>
      </FlexRow>
      {vurderinger.sort(byCreatedAt).map((vurdering, index) => (
        <HistorikkElement key={index} vurdering={vurdering} />
      ))}
    </AktivitetskravPanel>
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
    default: {
      return "";
    }
  }
};

const HistorikkElement = ({ vurdering }: HistorikkElementProps) => {
  const { data: veilederinfo } = useVeilederInfoQuery(vurdering.createdBy);
  const header = `${headerPrefix(vurdering.status)} - ${tilDatoMedManedNavn(
    vurdering.createdAt
  )}`;

  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>{header}</Accordion.Header>
        <Accordion.Content>
          <Normaltekst>{vurdering.beskrivelse}</Normaltekst>
          <br />
          {veilederinfo?.navn}
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
