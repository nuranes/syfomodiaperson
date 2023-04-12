import React from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Accordion } from "@navikt/ds-react";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import { StetoskopIkon } from "../../../../img/ImageComponents";
import styled from "styled-components";
import { useBehandlerNavn } from "@/hooks/behandler/useBehandlerNavn";
const StyledImage = styled.img`
  margin-right: 0.5em;
`;

interface SamtalerAccordionListProps {
  meldinger: Melding[];
}

export const SamtaleAccordion = ({ meldinger }: SamtalerAccordionListProps) => {
  const behandlerNavn = useBehandlerNavn(meldinger[0].behandlerRef);
  const newestMelding = meldinger.slice(-1)[0];
  const dateAndTimeForNewestMelding = `${tilDatoMedManedNavnOgKlokkeslett(
    newestMelding.tidspunkt
  )}`;

  return (
    <Accordion>
      <Accordion.Item>
        <Accordion.Header>
          <StyledImage src={StetoskopIkon} alt="Stetoskop ikon for behandler" />
          {`${behandlerNavn} ${dateAndTimeForNewestMelding}`}
        </Accordion.Header>
        <Accordion.Content>
          <MeldingerISamtale meldinger={meldinger} />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
