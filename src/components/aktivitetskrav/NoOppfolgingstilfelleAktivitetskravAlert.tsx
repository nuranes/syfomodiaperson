import React from "react";
import styled from "styled-components";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const texts = {
  alert:
    "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.",
};

const StyledAlertstripe = styled(AlertstripeFullbredde)`
  margin-bottom: 1em;
`;

export const NoOppfolgingstilfelleAktivitetskravAlert =
  (): React.ReactElement => {
    return <StyledAlertstripe type="advarsel">{texts.alert}</StyledAlertstripe>;
  };
