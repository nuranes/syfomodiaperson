import React from "react";
import { MeldingDTO } from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Accordion } from "@navikt/ds-react";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import { StetoskopIkon } from "../../../../img/ImageComponents";
import styled from "styled-components";
import { useBehandlerNavn } from "@/hooks/behandler/useBehandlerNavn";
import { SamtaleTags } from "@/components/behandlerdialog/meldinger/SamtaleTags";
import { FlexRow } from "@/components/Layout";

const StyledImage = styled.img`
  margin-right: 0.5em;
`;

interface SamtaleAccordionItemProps {
  meldinger: MeldingDTO[];
}

export const SamtaleAccordionItem = ({
  meldinger,
}: SamtaleAccordionItemProps) => {
  const behandlerNavn = useBehandlerNavn(meldinger[0].behandlerRef);
  const newestMelding = meldinger.slice(-1)[0];
  const dateAndTimeForNewestMelding = `${tilDatoMedManedNavnOgKlokkeslett(
    newestMelding.tidspunkt
  )}`;

  return (
    <Accordion.Item>
      <Accordion.Header>
        <FlexRow>
          <StyledImage src={StetoskopIkon} alt="Stetoskopikon for behandler" />
          {`${behandlerNavn} ${dateAndTimeForNewestMelding}`}
          <SamtaleTags meldinger={meldinger} />
        </FlexRow>
      </Accordion.Header>
      <Accordion.Content>
        <MeldingerISamtale meldinger={meldinger} />
      </Accordion.Content>
    </Accordion.Item>
  );
};
