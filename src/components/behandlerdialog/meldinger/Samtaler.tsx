import React, { useMemo } from "react";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  Conversations,
  Melding,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { Accordion, GuidePanel } from "@navikt/ds-react";
import { tilDatoMedManedNavnOgKlokkeslett } from "@/utils/datoUtils";
import styled from "styled-components";

const texts = {
  guidePanel:
    "Her kommer meldingene som blir sendt til og fra behandler(e) som er knyttet til personen. ",
};

const StyledSamtaler = styled.div`
  margin-top: 1.5em;
`;

const StyledGuidePanel = styled(GuidePanel)`
  margin-bottom: 1.5em;
  > * {
    min-height: 0;
  }
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

  const sortedConversations: Melding[][] = useMemo(() => {
    return data ? sortConversations(data.conversations) : [];
  }, [data]);

  return (
    <StyledSamtaler>
      {sortedConversations.length ? (
        sortedConversations.map((meldinger: Melding[], index: number) => {
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
        })
      ) : (
        <StyledGuidePanel>{texts.guidePanel}</StyledGuidePanel>
      )}
    </StyledSamtaler>
  );
};
