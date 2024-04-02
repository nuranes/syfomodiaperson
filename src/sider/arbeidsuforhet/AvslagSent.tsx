import React from "react";
import { Box, Heading, List } from "@navikt/ds-react";

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
    <Box background="surface-default" padding="4">
      <Heading className="mb-4" level="2" size="medium">
        {texts.title}
      </Heading>
      <List as="ol" size="small">
        {texts.todo.map((todo, index) => (
          <List.Item key={index}>{todo}</List.Item>
        ))}
      </List>
    </Box>
  );
};
