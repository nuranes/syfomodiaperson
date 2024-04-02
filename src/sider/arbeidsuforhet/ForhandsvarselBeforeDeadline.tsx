import React from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Alert, BodyLong, Box, Button, Heading } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { VisBrev } from "@/components/VisBrev";
import { tilLesbarDatoMedArUtenManedNavn } from "@/utils/datoUtils";
import { ClockIcon } from "@navikt/aksel-icons";
import { Link } from "react-router-dom";
import { arbeidsuforhetOppfyltPath } from "@/routers/AppRouter";

const texts = {
  title: "Venter på svar fra bruker",
  sentAlert: {
    isSent: (sentDate: Date) =>
      `Forhåndsvarselet er sendt ${tilLesbarDatoMedArUtenManedNavn(sentDate)}.`,
    passert:
      "Når fristen er passert vil det dukke opp en hendelse i oversikten.",
  },
  sendtInfo:
    "Dersom du har mottatt nye opplysninger og vurdert at bruker likevel oppfyller § 8-4, klikker du på Oppfylt-knappen. Du kan ikke avslå før fristen er gått ut.",
  frist: "Fristen går ut: ",
  oppfylt: "Oppfylt",
  avslag: "Avslag",
  seSendtVarsel: "Se sendt varsel",
};

export const ForhandsvarselBeforeDeadline = () => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const forhandsvarsel = data[0];
  const frist = forhandsvarsel.varsel?.svarfrist;

  return (
    <div>
      <Alert variant="success" className="mb-2">
        <p className="mb-0">
          {texts.sentAlert.isSent(forhandsvarsel.createdAt)}
        </p>
        <p>{texts.sentAlert.passert}</p>
      </Alert>
      <Box background="surface-default" padding="4" className="[&>*]:mb-4">
        <div className="flex items-center">
          <Heading level="2" size="medium">
            {texts.title}
          </Heading>
          <div className="ml-auto mr-4">
            <b>{texts.frist}</b>
            <span>{tilLesbarDatoMedArUtenManedNavn(frist)}</span>
          </div>
          <ClockIcon title="klokkeikon" fontSize="2em" />
        </div>
        <BodyLong>{texts.sendtInfo}</BodyLong>
        <ButtonRow>
          <Button variant="primary" disabled>
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
    </div>
  );
};
