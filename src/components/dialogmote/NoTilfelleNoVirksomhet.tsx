import { Normaltekst } from "nav-frontend-typografi";
import React from "react";
import styled from "styled-components";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const AdvarselStripe = styled(AlertstripeFullbredde)`
  margin-bottom: 1em;
`;

export const texts = {
  noVirksomhet:
    "Denne arbeidstakeren har ingen aktiv sykemelding, og vi har ingen informasjon om arbeidsgiver. Dersom du " +
    "har behov for å kalle inn til dialogmøte, opprett sak i porten.",
};

export const NoTilfelleNoVirksomhet = (): React.ReactElement => (
  <AdvarselStripe type="advarsel">
    <Normaltekst>{texts.noVirksomhet}</Normaltekst>
  </AdvarselStripe>
);
