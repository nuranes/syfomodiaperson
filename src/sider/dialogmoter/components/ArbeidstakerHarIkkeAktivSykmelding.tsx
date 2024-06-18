import React from "react";
import { Alert } from "@navikt/ds-react";

export const texts = {
  arbeidstakerHarIkkeAktivSykmelding:
    "Denne arbeidstakeren har ingen aktiv sykmelding. Du kan likevel kalle inn til dialogmøte hvis det er behov for det.",
};

export const ArbeidstakerHarIkkeAktivSykmeldingAdvarsel =
  (): React.ReactElement => (
    <Alert variant="warning" size="small" className="mb-4 [&>*]:max-w-fit">
      {texts.arbeidstakerHarIkkeAktivSykmelding}
    </Alert>
  );
