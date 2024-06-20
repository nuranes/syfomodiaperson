import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { BodyShort, Box, Detail, Heading } from "@navikt/ds-react";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";
import { ArbeidsuforhetButtons } from "@/sider/arbeidsuforhet/ArbeidsuforhetButtons";

const texts = {
  title: "Fristen er gått ut",
  passertAlert: (sentDate: Date) =>
    `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      sentDate
    )} er gått ut. Trykk på Innstilling om avslag-knappen hvis vilkårene i § 8-4 ikke er oppfylt og rett til videre sykepenger skal avslås.`,
  seSendtVarsel: "Se sendt varsel",
};

export const ForhandsvarselAfterDeadline = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];

  return (
    <Box background="surface-default" padding="4" className="mb-2 [&>*]:mb-4">
      <div className="flex items-center">
        <Heading level="2" size="medium">
          {texts.title}
        </Heading>
        <Detail weight="semibold" className="ml-auto mr-4 text-lg">
          {tilLesbarDatoMedArUtenManedNavn(forhandsvarsel.varsel?.svarfrist)}
        </Detail>
        <BellIcon title="bjelleikon" fontSize="2em" />
      </div>
      <BodyShort>{texts.passertAlert(forhandsvarsel.createdAt)}</BodyShort>
      <ArbeidsuforhetButtons isBeforeForhandsvarselDeadline={false} />
    </Box>
  );
};
