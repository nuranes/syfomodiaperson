import React, { useState } from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
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

interface SamtalerAccordionListProps {
  meldinger: Melding[];
}

export const SamtaleAccordion = ({ meldinger }: SamtalerAccordionListProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const behandlerNavn = useBehandlerNavn(meldinger[0].behandlerRef);
  const newestMelding = meldinger.slice(-1)[0];
  const dateAndTimeForNewestMelding = `${tilDatoMedManedNavnOgKlokkeslett(
    newestMelding.tidspunkt
  )}`;

  const toggleIsOpen = () => setIsOpen(!isOpen);

  return (
    <Accordion>
      <Accordion.Item open={isOpen}>
        <Accordion.Header onClick={toggleIsOpen}>
          <FlexRow>
            <StyledImage
              src={StetoskopIkon}
              alt="Stetoskopikon for behandler"
            />
            {`${behandlerNavn} ${dateAndTimeForNewestMelding}`}
            <SamtaleTags meldinger={meldinger} />
          </FlexRow>
        </Accordion.Header>
        <Accordion.Content>
          <MeldingerISamtale meldinger={meldinger} skalHenteVedlegg={isOpen} />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
};
