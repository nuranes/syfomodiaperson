import { BodyShort, Heading, List } from "@navikt/ds-react";
import React from "react";

const texts = {
  title: "Forberedelser",
  intro:
    "Her er noen punkter som må være på plass før du fatter vedtak og ordningen starter:",
  preparations: [
    "Forsikre deg om at utbetaling av sykepenger er igangsatt",
    "Er bruker frisk nok til å bytte arbeid?",
    "Bruker må være informert om ordningen og medfølgende plikter",
    "Har du fått bekreftelse på oppsigelse?",
    "Har du fått bekreftelse på fritak fra oppsigelsestiden?",
    "Du må fatte et § 14a-vedtak i Arena",
  ],
  diclaimer:
    "Vedtak om friskmelding til arbeidsformidling kan ikke fattes med tilbakevirkende kraft. Du trenger ikke å sjekke infotrygd når du fatter vedtak herfra.",
};

export const VedtakForberedelser = () => (
  <div>
    <Heading level="3" size="small">
      {texts.title}
    </Heading>
    <BodyShort size="small">{texts.intro}</BodyShort>
    <List as="ul" size="small">
      {texts.preparations.map((text, index) => (
        <List.Item key={index}>{text}</List.Item>
      ))}
    </List>
    <BodyShort className="mt-6" size="small">
      {texts.diclaimer}
    </BodyShort>
  </div>
);
