import React from "react";
import { Alert } from "@navikt/ds-react";

const texts = {
  title: "Du har gitt avslag i modia og oppgaven er fjernet fra oversikten.",
  nb: "NB!",
  nextStep:
    "Husk å lage innstilling i forvaltningsnotat i Gosys og lage oppgave og sende til NAY.",
};

export const AvslagSent = () => {
  return (
    <Alert variant="success" className="mb-2">
      <p>{texts.title}</p>
      <p>
        <b>{texts.nb}</b> {texts.nextStep}
      </p>
    </Alert>
  );
};
