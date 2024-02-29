import React from "react";
import { Alert, Box, Button, Heading } from "@navikt/ds-react";
import { ButtonRow } from "@/components/Layout";
import { useArbeidsuforhetVarselDocument } from "@/hooks/arbeidsuforhet/useArbeidsuforhetVarselDocument";
import { VisBrev } from "@/components/VisBrev";

const texts = {
  title: "Venter på svar fra bruker",
  iSendt: "Forhåndsvarselet er sendt til bruker",
  isPassert: "Tiden har gått ut på forhåndsvarselet.",
  sendtInfo:
    "Om du får svar fra bruker, og hen oppfyller kravene om 8-4 etter din vurdering, klikker du på “oppfylt”-knappen under. Om ikke må du vente til tiden går ut før du kan gi avslag.",
  passertInfo: "Tiden har gått ut og du kan nå gå videre med å sende avslag.",
  seSendtBrev: "Se sendt brev",
  oppfylt: "Oppfylt",
  avslag: "Avslag",
  frist: "Fristen går ut:",
};

export const ForhandsvarselSendt = () => {
  const { getForhandsvarselDocument } = useArbeidsuforhetVarselDocument();

  return (
    <div>
      <Alert variant="success" className="mb-2">
        {texts.iSendt}
      </Alert>
      <Box background="surface-default" padding="3" className="mb-2">
        <Heading className="mt-4 mb-4" level="2" size="small">
          {texts.title}
        </Heading>
        <p>{texts.sendtInfo}</p>
        <ButtonRow className="flex">
          <VisBrev
            document={getForhandsvarselDocument({
              begrunnelse: "Her må begrunnelsen være",
              frist: new Date(),
            })}
          />
          <Button variant="secondary" className="ml-auto">
            {texts.oppfylt}
          </Button>
          <Button variant="secondary" disabled>
            {texts.avslag}
          </Button>
        </ButtonRow>
      </Box>
    </div>
  );
};
