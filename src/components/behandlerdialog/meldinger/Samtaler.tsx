import React, { useMemo } from "react";
import { useBehandlerdialogQuery } from "@/data/behandlerdialog/behandlerdialogQueryHooks";
import {
  Conversations,
  MeldingDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { GuidePanel } from "@navikt/ds-react";
import styled from "styled-components";
import { SamtaleAccordion } from "@/components/behandlerdialog/meldinger/SamtaleAccordion";
import AppSpinner from "@/components/AppSpinner";

const texts = {
  guidePanel: "Her kommer meldinger sendt til og fra behandler.",
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
  m1: MeldingDTO,
  m2: MeldingDTO,
  order: "asc" | "desc" = "asc"
) => {
  return order === "desc"
    ? new Date(m2.tidspunkt).getTime() - new Date(m1.tidspunkt).getTime()
    : new Date(m1.tidspunkt).getTime() - new Date(m2.tidspunkt).getTime();
};

export const sortConversations = (
  conversations: Conversations
): MeldingDTO[][] => {
  const conversationRefs: string[] = Object.keys(conversations);
  conversationRefs.sort((a, b) => {
    const aNewestMelding: MeldingDTO = conversations[a]
      .sort((m1, m2) => sortMeldingerByTidspunkt(m1, m2))
      .slice(-1)[0];
    const bNewestMelding: MeldingDTO = conversations[b]
      .sort((m1, m2) => sortMeldingerByTidspunkt(m1, m2))
      .slice(-1)[0];
    return sortMeldingerByTidspunkt(aNewestMelding, bNewestMelding, "desc");
  });

  return conversationRefs.map((ref: string) => conversations[ref]);
};

export const Samtaler = () => {
  const { data, isInitialLoading } = useBehandlerdialogQuery();

  const sortedConversations: MeldingDTO[][] = useMemo(() => {
    return data ? sortConversations(data.conversations) : [];
  }, [data]);

  return (
    <StyledSamtaler>
      {isInitialLoading ? (
        <AppSpinner />
      ) : sortedConversations.length ? (
        <>
          {sortedConversations.map((meldinger: MeldingDTO[], index: number) => (
            <SamtaleAccordion meldinger={meldinger} key={index} />
          ))}
        </>
      ) : (
        <StyledGuidePanel>{texts.guidePanel}</StyledGuidePanel>
      )}
    </StyledSamtaler>
  );
};
