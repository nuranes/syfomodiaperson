import React, { ReactElement } from "react";
import { BodyShort, Box, Button, Heading, List } from "@navikt/ds-react";

const texts = {
  title: "Avslutt oppgave",
  intro:
    "Vedtak om friskmelding til arbeidsformidling starter i morgen. For å sikre kontinuitet i utbetalingene til bruker er det viktig at du følger de neste stegene.",
  husk: "Dette må du huske å gjøre før du avslutter oppgaven:",
  steps: [
    "Gå inn i Arena og avslutt sykefraværet fra oppgaven 'Oppfølging for sykmeldt arbeidstaker'",
    "Opprett oppgave til NAY i Gosys",
  ],
  outro:
    "Etter at du avslutter oppgaven her, fjernes oppgaven fra Modia og du trenger ikke foreta deg noe mer.",
  button: "Avslutt oppgave",
};

export const AvsluttOppgave = (): ReactElement => (
  <Box background="surface-default" padding="6" className="flex flex-col gap-4">
    <Heading level="2" size="medium">
      {texts.title}
    </Heading>
    <BodyShort size="small">{texts.intro}</BodyShort>
    <List as="ol" size="small" title={texts.husk}>
      {texts.steps.map((text, index) => (
        <List.Item key={index}>{text}</List.Item>
      ))}
    </List>
    <BodyShort size="small">{texts.outro}</BodyShort>
    <Button className="w-fit">{texts.button}</Button>
  </Box>
);
