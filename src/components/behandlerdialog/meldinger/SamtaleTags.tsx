import { Tag } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import { Melding } from "@/data/behandlerdialog/behandlerdialogTypes";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { ubehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";

const texts = {
  ny: "Ny",
  manglerSvar: "Venter på svar fra lege",
};

const StyledWrapper = styled.div`
  margin-left: 1em;
`;

interface SamtaleTagsProps {
  meldinger: Melding[];
}

export const SamtaleTags = ({ meldinger }: SamtaleTagsProps) => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const ubehandledeBehandlerDialogSvarOppgaver = ubehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_SVAR
  );
  const hasMeldingMedUbehandletOppgave = meldinger.some((melding) =>
    ubehandledeBehandlerDialogSvarOppgaver.some(
      (oppgave) => oppgave.referanseUuid === melding.uuid
    )
  );
  const manglerSvarFraBehandler = !meldinger.some(
    (melding) => melding.innkommende
  );

  return (
    <StyledWrapper>
      {hasMeldingMedUbehandletOppgave && (
        <Tag size="small" variant="info">
          {texts.ny}
        </Tag>
      )}
      {manglerSvarFraBehandler && (
        <Tag size="small" variant="warning">
          {texts.manglerSvar}
        </Tag>
      )}
    </StyledWrapper>
  );
};
