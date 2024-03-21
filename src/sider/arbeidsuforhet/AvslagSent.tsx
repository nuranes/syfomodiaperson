import React from "react";
import { Box } from "@navikt/ds-react";

const texts = {
  title: "Husk å opprette oppgave i Gosys",
  todo: [
    "Gå inn i Gosys",
    "Lag innstilling i forvaltningsnotat",
    "Lag oppgave",
    "Send til NAY",
  ],
};

export const AvslagSent = () => {
  return (
    <Box background="surface-default" padding="6">
      <h1>{texts.title}</h1>
      <ol>
        {texts.todo.map((todo, index) => (
          <li key={index}>{todo}</li>
        ))}
      </ol>
    </Box>
  );
};
