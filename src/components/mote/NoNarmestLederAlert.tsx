import React from "react";
import { AlertstripeFullbredde } from "@/components/AlertstripeFullbredde";

const texts = {
  noNarmesteleder:
    "Det er ikke registrert en nærmeste leder fra denne arbeidsgiveren, derfor sender vi dette brevet automatisk " +
    "til Altinn. Lederen må registrere seg som nærmeste leder i Altinn for å kunne gi svar på Nav.no.",
};

export const NoNarmesteLederAlert = () => (
  <AlertstripeFullbredde type="advarsel">
    <p>{texts.noNarmesteleder}</p>
  </AlertstripeFullbredde>
);
