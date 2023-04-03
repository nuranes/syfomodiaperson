import React from "react";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import { Accordion } from "@navikt/ds-react";
import { MeldingerISamtale } from "@/components/behandlerdialog/meldinger/MeldingerISamtale";
import { StetoskopIkon } from "../../../../img/ImageComponents";
import styled from "styled-components";

const StyledImage = styled.img`
  margin-right: 0.5em;
`;

interface SamtalerAccordionListProps {
  sortedConversations: Melding[][];
}

export const SamtalerAccordionList = ({
  sortedConversations,
}: SamtalerAccordionListProps) => {
  return (
    <>
      {sortedConversations.map((meldinger: Melding[], index: number) => {
        const newestMelding = meldinger.slice(-1)[0];
        const dateAndTimeForNewestMelding = `${tilDatoMedManedNavnOgKlokkeslett(
          newestMelding.tidspunkt
        )}`;
        return (
          <Accordion key={index}>
            <Accordion.Item>
              <Accordion.Header>
                <StyledImage
                  src={StetoskopIkon}
                  alt="Stetoskop ikon for behandler"
                />
                {`${meldinger[0].behandlerRef} ${dateAndTimeForNewestMelding}`}
              </Accordion.Header>{" "}
              {/*TODO: Hent behandlernavn basert på behandlerRef*/}
              <Accordion.Content>
                <MeldingerISamtale meldinger={meldinger} />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        );
      })}
    </>
  );
};
