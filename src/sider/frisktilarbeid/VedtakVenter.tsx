import React, { ReactElement } from "react";
import { Alert, BodyLong, BodyShort } from "@navikt/ds-react";
import { VedtakResponseDTO } from "@/data/frisktilarbeid/frisktilarbeidTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";

const texts = {
  part1:
    "Vedtaket om friskmelding til arbeidsformidling er nå fattet og sendt til bruker. Du finner igjen vedtaket i historikken. Behandler er automatisk informert om vedtaket. Du trenger ikke å gjøre noe mer i saken før startdato for ordningen nærmer seg.  ",
  part2: "Du vil få en oppgave i oversikten dagen før vedtaket starter.",
  part3: "Friskmelding til arbeidsformidling starter:",
};

interface VedtakVenterProps {
  vedtak: VedtakResponseDTO;
}

export const VedtakVenter = ({ vedtak }: VedtakVenterProps): ReactElement => {
  return (
    <Alert variant="success">
      <div className="flex flex-col gap-8">
        <BodyLong>{texts.part1}</BodyLong>
        <BodyShort>{texts.part2}</BodyShort>
        <BodyShort>
          {`${texts.part3} `}
          <strong>{tilLesbarDatoMedArUtenManedNavn(vedtak.fom)}</strong>
        </BodyShort>
      </div>
    </Alert>
  );
};
