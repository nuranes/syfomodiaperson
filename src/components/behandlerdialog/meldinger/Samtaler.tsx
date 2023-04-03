import React, { useMemo } from "react";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  Conversations,
  Melding,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { GuidePanel } from "@navikt/ds-react";
import styled from "styled-components";
import { SamtalerAccordionList } from "@/components/behandlerdialog/meldinger/SamtalerAccordionList";
import AppSpinner from "@/components/AppSpinner";

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

const sortMeldingerByTidspunkt = (
  m1: Melding,
  m2: Melding,
  order: "asc" | "desc" = "asc"
) => {
  return order === "desc"
    ? new Date(m2.tidspunkt).getTime() - new Date(m1.tidspunkt).getTime()
    : new Date(m1.tidspunkt).getTime() - new Date(m2.tidspunkt).getTime();
};

export const sortConversations = (
  conversations: Conversations
): Melding[][] => {
  const conversationRefs: string[] = Object.keys(conversations);
  conversationRefs.sort((a, b) => {
    const aNewestMelding: Melding = conversations[a]
      .sort((m1, m2) => sortMeldingerByTidspunkt(m1, m2))
      .slice(-1)[0];
    const bNewestMelding: Melding = conversations[b]
      .sort((m1, m2) => sortMeldingerByTidspunkt(m1, m2))
      .slice(-1)[0];
    return sortMeldingerByTidspunkt(aNewestMelding, bNewestMelding, "desc");
  });

  return conversationRefs.map((ref: string) => conversations[ref]);
};

export const Samtaler = () => {
  const { data, isInitialLoading } = useBehandlerdialogQuery();

  const sortedConversations: Melding[][] = useMemo(() => {
    return data ? sortConversations(data.conversations) : [];
  }, [data]);

  return (
    <StyledSamtaler>
      {isInitialLoading ? (
        <AppSpinner />
      ) : sortedConversations.length ? (
        <SamtalerAccordionList sortedConversations={sortedConversations} />
      ) : (
        <StyledGuidePanel>{texts.guidePanel}</StyledGuidePanel>
      )}
    </StyledSamtaler>
  );
};
