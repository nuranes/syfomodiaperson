import React, { ReactElement } from "react";
import { BodyShort, Box, Heading, List } from "@navikt/ds-react";
import { FattVedtakSkjema } from "@/sider/frisktilarbeid/FattVedtakSkjema";

const texts = {
  forberedelser: {
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
    disclaimer:
      "Du trenger ikke å sjekke infotrygd når du fatter vedtak herfra.",
  },
  button: "Vurder vedtak",
};

export const FattNyttVedtak = (): ReactElement => {
  return (
    <div className="flex flex-col [&>*]:mb-4">
      <Box background="surface-default" padding="6">
        <Heading level="3" size="small">
          {texts.forberedelser.title}
        </Heading>
        <BodyShort size="small">{texts.forberedelser.intro}</BodyShort>
        <List as="ul" size="small">
          {texts.forberedelser.preparations.map((text, index) => (
            <List.Item key={index}>{text}</List.Item>
          ))}
        </List>
        <BodyShort className="mt-6" size="small">
          {texts.forberedelser.disclaimer}
        </BodyShort>
      </Box>
      <FattVedtakSkjema />
    </div>
  );
};
