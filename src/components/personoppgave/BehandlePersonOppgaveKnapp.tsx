import React from "react";
import { PersonOppgave } from "@/data/personoppgave/types/PersonOppgave";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { Checkbox, Panel } from "@navikt/ds-react";
import styled from "styled-components";
import navFarger from "nav-frontend-core";

const CheckboxPanel = styled(Panel)`
  border: 1px solid ${navFarger.navGra20};
`;

const ferdigbehandletText = (personOppgave: PersonOppgave) =>
  `Ferdigbehandlet av ${
    personOppgave.behandletVeilederIdent
  } ${toDatePrettyPrint(personOppgave.behandletTidspunkt)}`;

interface BehandlePersonoppgaveKnappProps {
  personOppgave: PersonOppgave | undefined;
  isBehandlet: boolean;
  handleBehandleOppgave: () => void;
  isBehandleOppgaveLoading: boolean;
  behandleOppgaveText: string;
}

const BehandlePersonOppgaveKnapp = ({
  personOppgave,
  isBehandlet,
  handleBehandleOppgave,
  isBehandleOppgaveLoading,
  behandleOppgaveText,
}: BehandlePersonoppgaveKnappProps) => {
  const oppgaveKnappText =
    isBehandlet && personOppgave
      ? ferdigbehandletText(personOppgave)
      : behandleOppgaveText;

  return (
    <CheckboxPanel>
      <Checkbox
        onClick={handleBehandleOppgave}
        disabled={isBehandlet || isBehandleOppgaveLoading}
        defaultChecked={isBehandlet}
        size="small"
      >
        {oppgaveKnappText}
      </Checkbox>
    </CheckboxPanel>
  );
};

export default BehandlePersonOppgaveKnapp;
