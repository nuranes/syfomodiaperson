import { Normaltekst } from "nav-frontend-typografi";
import React from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

export const texts = {
  arbeidstakerHarIkkeAktivSykmelding:
    "Denne arbeidstakeren har ingen aktiv sykmelding. Du kan likevel kalle inn til dialogmøte hvis det er behov for det.",
};

export const ArbeidstakerHarIkkeAktivSykmeldingAdvarsel =
  (): React.ReactElement => (
    <AlertstripeFullbredde type="advarsel" marginbottom="2em">
      <Normaltekst>{texts.arbeidstakerHarIkkeAktivSykmelding}</Normaltekst>
    </AlertstripeFullbredde>
  );
