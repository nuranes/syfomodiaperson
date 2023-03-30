import React, { useMemo } from "react";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  Conversations,
  Melding,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { Accordion } from "@navikt/ds-react";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import styled from "styled-components";

const StyledSamtaler = styled.div`
  margin-top: 1.5em;
`;

const sortMeldingerByTidspunkt = (m1: Melding, m2: Melding) => {
  return new Date(m2.tidspunkt).getTime() - new Date(m1.tidspunkt).getTime();
};

export const sortConversations = (
  conversations: Conversations
): Melding[][] => {
  const conversationRefs: string[] = Object.keys(conversations);
  conversationRefs.sort((a, b) => {
    const aNewestMelding: Melding = conversations[a].sort((m1, m2) =>
      sortMeldingerByTidspunkt(m1, m2)
    )[0];
    const bNewestMelding: Melding = conversations[b].sort((m1, m2) =>
      sortMeldingerByTidspunkt(m1, m2)
    )[0];
    return sortMeldingerByTidspunkt(aNewestMelding, bNewestMelding);
  });

  return conversationRefs.map((ref: string) => conversations[ref]);
};

export const Samtaler = () => {
  const { data } = useBehandlerdialogQuery();

  const sortedConversations = useMemo(() => {
    return data ? sortConversations(data.conversations) : [];
  }, [data]);

  return (
    <StyledSamtaler>
      {sortedConversations.map((meldinger: Melding[], index: number) => {
        const dateAndTimeForNewestMelding = `${tilDatoMedManedNavnOgKlokkeslett(
          meldinger[0].tidspunkt
        )}`;
        return (
          <Accordion key={index}>
            <Accordion.Item>
              <Accordion.Header>{`${meldinger[0].behandlerRef} ${dateAndTimeForNewestMelding}`}</Accordion.Header>{" "}
              {/*TODO: Hent behandlernavn basert på behandlerRef*/}
              <Accordion.Content>{meldinger[0].tekst}</Accordion.Content>{" "}
              {/*TODO: Utvid med visning for meldinger*/}
            </Accordion.Item>
          </Accordion>
        );
      })}
    </StyledSamtaler>
  );
};
