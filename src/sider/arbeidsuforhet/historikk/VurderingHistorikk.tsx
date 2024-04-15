import React from "react";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { useVeilederInfoQuery } from "@/data/veilederinfo/veilederinfoQueryHooks";
import { Paragraph } from "@/components/Paragraph";
import { tilDatoMedManedNavn } from "@/utils/datoUtils";
import { VisBrev } from "@/components/VisBrev";

const texts = {
  header: "Historikk",
  tidligereVurderinger: "Tidligere vurderinger av §8-4 arbeidsuførhet i Modia",
  noVurderinger:
    "Det finnes ingen tidligere vurderinger av §8-4 arbeidsuførhet i Modia",
  begrunnelseLabel: "Begrunnelse",
  vurdertLabel: "Vurdert av",
};

interface VurderingHistorikkItemProps {
  vurdering: VurderingResponseDTO;
}

const headerPrefix = (type: VurderingType): string => {
  switch (type) {
    case VurderingType.FORHANDSVARSEL: {
      return "Forhåndsvarsel";
    }
    case VurderingType.OPPFYLT: {
      return "Oppfylt";
    }
    case VurderingType.AVSLAG: {
      return "Avslag";
    }
  }
};

const getButtonText = (type: VurderingType): string => {
  switch (type) {
    case VurderingType.FORHANDSVARSEL: {
      return "Se sendt forhåndsvarsel";
    }
    case VurderingType.OPPFYLT: {
      return "Se oppfylt vurdering";
    }
    case VurderingType.AVSLAG: {
      return "Se innstilling om avslag";
    }
  }
};

const VurderingHistorikkItem = ({ vurdering }: VurderingHistorikkItemProps) => {
  const { type, begrunnelse, createdAt, veilederident } = vurdering;
  const { data: veilederinfo } = useVeilederInfoQuery(veilederident);
  const header = `${headerPrefix(type)} - ${tilDatoMedManedNavn(createdAt)}`;
  const buttonText = getButtonText(type);

  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        <Paragraph label={texts.begrunnelseLabel} body={begrunnelse} />
        <Paragraph
          label={texts.vurdertLabel}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
        <VisBrev document={vurdering.document} buttonText={buttonText} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export const VurderingHistorikk = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const subheader =
    data.length > 0 ? texts.tidligereVurderinger : texts.noVurderinger;

  return (
    <Box
      padding="6"
      background="surface-default"
      className="flex flex-col gap-8 mb-2"
    >
      <div>
        <Heading level="2" size="medium">
          {texts.header}
        </Heading>
        <BodyShort size="small">{subheader}</BodyShort>
      </div>
      <Accordion>
        {data.map((vurdering, index) => (
          <VurderingHistorikkItem key={index} vurdering={vurdering} />
        ))}
      </Accordion>
    </Box>
  );
};
