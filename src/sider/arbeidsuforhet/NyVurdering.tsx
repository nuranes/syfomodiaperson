import React, { ReactElement } from "react";
import { BodyShort, Box, Button, Heading } from "@navikt/ds-react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import {
  VurderingResponseDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { useNotification } from "@/context/notification/NotificationContext";

const texts = {
  title: "Arbeidsuførhet",
  siste: "Siste vurdering",
  button: "Start ny vurdering",
};

const lastVurderingText = (vurderinger: VurderingResponseDTO[]) => {
  if (vurderinger.length === 0) {
    return "Ingen vurderinger har blitt gjort, trykk på 'Start ny vurdering' for å sende forhåndsvarsel";
  }

  const lastVurdering = vurderinger[0];
  const lastForhandsvarsel = vurderinger.find(
    (vurdering) => vurdering.type === VurderingType.FORHANDSVARSEL
  );
  const lastVurderingType = lastVurdering?.type.toLowerCase();

  return `Forrige forhåndsvarsel på 8-4 ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
    lastForhandsvarsel?.createdAt
  )} og ${lastVurderingType} ${tilLesbarDatoMedArUtenManedNavn(
    lastVurdering?.createdAt
  )}`;
};

interface NyVurderingProps {
  handleClick: () => void;
}

export const NyVurdering = ({
  handleClick,
}: NyVurderingProps): ReactElement => {
  const { data: vurderinger } = useArbeidsuforhetVurderingQuery();
  const { notification } = useNotification();

  return (
    <>
      {notification && notification.message}
      <Box background="surface-default" padding="6">
        <Heading className="mb-4" level="2" size="medium">
          {texts.siste}
        </Heading>
        <BodyShort className="mb-4">{`${lastVurderingText(
          vurderinger
        )}`}</BodyShort>
        <Button onClick={handleClick} variant="secondary">
          {texts.button}
        </Button>
      </Box>
    </>
  );
};
