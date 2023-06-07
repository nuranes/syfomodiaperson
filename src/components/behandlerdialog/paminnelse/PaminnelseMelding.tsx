import { BellIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import React from "react";
import styled from "styled-components";
import {
  MeldingDTO,
  PaminnelseDTO,
} from "@/data/behandlerdialog/behandlerdialogTypes";
import { usePaminnelseTilBehandler } from "@/data/behandlerdialog/usePaminnelseTilBehandler";
import { usePersonoppgaverQuery } from "@/data/personoppgave/personoppgaveQueryHooks";
import { getAllUbehandledePersonOppgaver } from "@/utils/personOppgaveUtils";
import { PersonOppgaveType } from "@/data/personoppgave/types/PersonOppgave";

const texts = {
  button: "Send påminnelse til behandler",
};

const StyledButton = styled(Button)`
  align-self: flex-start;
`;

interface PaminnelseMeldingProps {
  melding: MeldingDTO;
}

export const PaminnelseMelding = ({ melding }: PaminnelseMeldingProps) => {
  const { data: oppgaver } = usePersonoppgaverQuery();
  const ubehandledeUbesvartMeldingOppgaver = getAllUbehandledePersonOppgaver(
    oppgaver,
    PersonOppgaveType.BEHANDLERDIALOG_MELDING_UBESVART
  );
  const hasUbesvartMeldingOppgave = ubehandledeUbesvartMeldingOppgaver.some(
    (oppgave) => oppgave.referanseUuid === melding.uuid
  );

  const paminnelseTilBehandler = usePaminnelseTilBehandler(melding.uuid);
  const handleSendPaminnelseClick = () => {
    const paminnelseDTO: PaminnelseDTO = {
      document: [], // TODO: Add paminnelse document texts
    };
    paminnelseTilBehandler.mutate(paminnelseDTO);
  };

  // TODO: Behandle oppgave on click ?

  return hasUbesvartMeldingOppgave ? (
    <StyledButton
      icon={<BellIcon aria-hidden />}
      onClick={handleSendPaminnelseClick}
    >
      {texts.button}
    </StyledButton>
  ) : (
    <></>
  );
};
