import { Tag } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import {
  MeldingDTO,
  MeldingStatusType,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";

const texts = {
  ny: "Ny",
  manglerSvar: "Venter på svar",
  avvist: "Melding ikke levert",
};

const StyledWrapper = styled.div`
  margin-left: 1em;
`;

interface SamtaleTagsProps {
  meldinger: MeldingDTO[];
}

export const SamtaleTags = ({ meldinger }: SamtaleTagsProps) => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const ubehandledeBehandlerDialogSvarOppgaver =
    getAllUbehandledePersonOppgaver(
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
  const harAvvistMelding = meldinger.some(
    (melding) => melding.status?.type === MeldingStatusType.AVVIST
  );

  return (
    <StyledWrapper>
      {harAvvistMelding ? (
        <Tag size="small" variant="error">
          {texts.avvist}
        </Tag>
      ) : (
        <>
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
        </>
      )}
    </StyledWrapper>
  );
};
