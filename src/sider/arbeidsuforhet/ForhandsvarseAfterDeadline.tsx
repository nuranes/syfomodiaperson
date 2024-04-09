import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { BodyShort, Box, Button, Detail, Heading } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { VisBrev } from "@/components/VisBrev";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { BellIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";
import { useSendVurderingArbeidsuforhet } from "@/data/arbeidsuforhet/useSendVurderingArbeidsuforhet";
import {
  VurderingRequestDTO,
  VurderingType,
} from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { useNotification } from "@/context/notification/NotificationContext";
import { AvslagSent } from "@/sider/arbeidsuforhet/AvslagSent";

const texts = {
  title: "Fristen er gått ut",
  passertAlert: (sentDate: Date) =>
    `Fristen for forhåndsvarselet som ble sendt ut ${tilLesbarDatoMedArUtenManedNavn(
      sentDate
    )} er gått ut. Trykk på Avslag-knappen hvis vilkårene i § 8-4 ikke er oppfylt og rett til videre sykepenger skal avslås.`,
  avslag: "Avslag",
  oppfylt: "Oppfylt",
  seSendtVarsel: "Se sendt varsel",
};

export const ForhandsvarselAfterDeadline = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const sendVurdering = useSendVurderingArbeidsuforhet();
  const { setNotification } = useNotification();

  const handleAvslag = () => {
    const vurderingRequestDTO: VurderingRequestDTO = {
      type: VurderingType.AVSLAG,
      begrunnelse: "",
      document: [],
    };

    sendVurdering.mutate(vurderingRequestDTO, {
      onSuccess: () => {
        setNotification({
          message: <AvslagSent />,
        });
      },
    });
  };

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
      <ButtonRow>
        <Button
          variant="primary"
          onClick={handleAvslag}
          loading={sendVurdering.isPending}
        >
          {texts.avslag}
        </Button>
        <Button as={Link} to={arbeidsuforhetOppfyltPath} variant="secondary">
          {texts.oppfylt}
        </Button>
        <VisBrev
          document={forhandsvarsel.document}
          buttonText={texts.seSendtVarsel}
        />
      </ButtonRow>
    </Box>
  );
};
