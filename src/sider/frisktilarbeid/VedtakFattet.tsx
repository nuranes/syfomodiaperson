import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import React, { ReactElement } from "react";
import { Alert, BodyShort, Box, Button, Heading, List } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import dayjs from "dayjs";

const texts = {
  alert:
    "Vedtaket om friskmelding til arbeidsformidling er nå fattet og sendt til bruker. Du finner igjen vedtaket i historikken. Behandler er automatisk informert om vedtaket. Ny oppgave er lagt til i oversikten din.",
  heading: "Friskmelding til arbeidsformidling starter:",
  husk: "Dagen før vedtaket starter må du huske å gjøre følgende:",
  steps: [
    "Gå inn i Arena og avslutt sykefraværet fra oppgaven 'Oppfølging for sykmeldt arbeidstaker'",
    "Opprett oppgave til NAY i Gosys",
  ],
  avslutt:
    "Etter at du avslutter oppgaven her, fjernes oppgaven fra oversikten og du trenger ikke å foreta deg noe mer.",
  button: "Avslutt oppgave",
};

interface VedtakFattetProps {
  vedtak: VedtakResponseDTO;
}

export const VedtakFattet = ({ vedtak }: VedtakFattetProps): ReactElement => {
  const vedtakStartedOrStartingTomorrow = !dayjs().isBefore(
    dayjs(vedtak.fom).subtract(1, "days")
  );

  return (
    <div className="flex flex-col gap-4">
      {!vedtakStartedOrStartingTomorrow && (
        <Alert variant="success">{texts.alert}</Alert>
      )}
      <Box
        background="surface-default"
        padding="6"
        className="flex flex-col gap-4"
      >
        <Heading level="2" size="medium">
          {`${texts.heading} ${tilLesbarDatoMedArUtenManedNavn(vedtak.fom)}`}
        </Heading>
        <List as="ol" title={texts.husk}>
          {texts.steps.map((text, index) => (
            <List.Item key={index}>{text}</List.Item>
          ))}
        </List>
        {vedtakStartedOrStartingTomorrow && (
          <>
            <BodyShort>{texts.avslutt}</BodyShort>
            <Button className="w-fit">{texts.button}</Button>
          </>
        )}
      </Box>
    </div>
  );
};
