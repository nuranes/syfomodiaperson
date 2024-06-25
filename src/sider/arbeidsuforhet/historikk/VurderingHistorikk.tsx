import React from "react";
import { Accordion, BodyShort, Box, Heading } from "@navikt/ds-react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  arsakTexts,
  typeTexts,
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
  arsakLabel: "Årsak",
  vurdertLabel: "Vurdert av",
};

interface VurderingHistorikkItemProps {
  vurdering: VurderingResponseDTO;
}

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
    case VurderingType.IKKE_AKTUELL: {
      throw new Error("Not supported");
    }
  }
};

const VurderingHistorikkItem = ({ vurdering }: VurderingHistorikkItemProps) => {
  const { type, arsak, begrunnelse, createdAt, veilederident } = vurdering;
  const { data: veilederinfo } = useVeilederInfoQuery(veilederident);
  const header = `${typeTexts[type]} - ${tilDatoMedManedNavn(createdAt)}`;
  return (
    <Accordion.Item>
      <Accordion.Header>{header}</Accordion.Header>
      <Accordion.Content>
        {begrunnelse && (
          <Paragraph label={texts.begrunnelseLabel} body={begrunnelse} />
        )}
        {arsak && (
          <Paragraph label={texts.arsakLabel} body={arsakTexts[arsak]} />
        )}
        <Paragraph
          label={texts.vurdertLabel}
          body={veilederinfo?.fulltNavn() ?? ""}
        />
        {type !== VurderingType.IKKE_AKTUELL && (
          <VisBrev
            document={vurdering.document}
            buttonText={getButtonText(type)}
          />
        )}
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
