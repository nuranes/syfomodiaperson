import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { VisBrev } from "@/components/VisBrev";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";

const texts = {
  title: "Fristen er utgått!",
  passertAlert: (sentDate: Date) =>
    `Forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      sentDate
    )} er gått ut! Du kan nå gi avslag på Arbeidsuførhet.`,
  oppfylt: "Oppfylt",
  avslag: "Avslag",
  seSendtBrev: "Se sendt brev",
};

export const ForhandsvarselAfterDeadline = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];

  return (
    <Box background="surface-default" padding="3" className="mb-2">
      <div className="flex items-center">
        <Heading className="mt-2 mb-4" level="2" size="small">
          {texts.title}
        </Heading>
        <b className="ml-auto mr-4">
          {tilLesbarDatoMedArUtenManedNavn(forhandsvarsel.varsel?.svarfrist)}
        </b>
        <BellIcon title="bjelleikon" fontSize="2em" />
      </div>
      <BodyShort className="mt-4 mb-8">
        {texts.passertAlert(forhandsvarsel.createdAt)}
      </BodyShort>
      <ButtonRow>
        <Button variant="primary">{texts.avslag}</Button>
        <Button as={Link} to={arbeidsuforhetOppfyltPath} variant="secondary">
          {texts.oppfylt}
        </Button>
        <VisBrev document={forhandsvarsel.document} />
      </ButtonRow>
    </Box>
  );
};
