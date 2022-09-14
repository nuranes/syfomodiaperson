import { Normaltekst } from "nav-frontend-typografi";
import React from "react";
import styled from "styled-components";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

export const texts = {
  arbeidstakerHarIkkeAktivSykmelding:
    "Denne arbeidstakeren har ingen aktiv sykmelding. Du kan likevel kalle inn til dialogmøte hvis det er behov for det.",
};

const AdvarselStripe = styled(AlertstripeFullbredde)`
  margin-bottom: 2em;
`;

export const ArbeidstakerHarIkkeAktivSykmeldingAdvarsel =
  (): React.ReactElement => (
    <AdvarselStripe type="advarsel">
      <Normaltekst>{texts.arbeidstakerHarIkkeAktivSykmelding}</Normaltekst>
    </AdvarselStripe>
  );
