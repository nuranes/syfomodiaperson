import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Alert, Box, Button, Heading } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { VisBrev } from "@/components/VisBrev";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";

const texts = {
  title: "Venter på svar fra bruker",
  passertAlert: (sentDate: Date) =>
    `Forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      sentDate
    )} er gått ut!`,
  isPassert: "Tiden har gått ut på forhåndsvarselet.",
  passertInfo: "Tiden har gått ut og du kan nå gå videre med å sende avslag.",
  seSendtBrev: "Se sendt brev",
  oppfylt: "Oppfylt",
  avslag: "Avslag",
  frist: "Fristen er utgått!",
};

export const ForhandsvarselAfterDeadline = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];

  return (
    <div>
      <Alert variant="warning" className="mb-2">
        {texts.passertAlert(forhandsvarsel.createdAt)}
      </Alert>
      <Box background="surface-default" padding="3" className="mb-2">
        <div className="flex items-center">
          <Heading className="mt-2 mb-4" level="2" size="small">
            {texts.title}
          </Heading>
          <b className="ml-auto mr-4">{texts.frist}</b>
          <BellIcon title="bjelleikon" fontSize="2em" />
        </div>
        <p>{texts.passertInfo}</p>
        <ButtonRow className="flex">
          <VisBrev document={forhandsvarsel.document} />
          <Button variant="secondary" className="ml-auto">
            {texts.oppfylt}
          </Button>
          <Button variant="secondary">{texts.avslag}</Button>
        </ButtonRow>
      </Box>
    </div>
  );
};
