import React from "react";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import BehandleOppfolgingsplanLPS from "./BehandleOppfolgingsplanLPS";
import { LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";
import { Box, Heading, Tag } from "@navikt/ds-react";

const texts = {
  buttonOpenPlan: "Åpne oppfølgingsplanen(pdf)",
};

interface ButtonOpenPlanProps {
  oppfolgingsplanLPS: OppfolgingsplanLPS;
}

export const ButtonOpenPlan = (buttonOpenPlanProps: ButtonOpenPlanProps) => {
  return (
    <a
      className="lenke"
      href={`${LPS_OPPFOLGINGSPLAN_MOTTAK_V1_ROOT}/oppfolgingsplan/lps/${buttonOpenPlanProps.oppfolgingsplanLPS.uuid}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {texts.buttonOpenPlan}
    </a>
  );
};

interface BehandleOppfolgingsplanLPSProps {
  oppfolgingsplanLPSBistandsbehov: OppfolgingsplanLPS;
}

const OppfolgingsplanerOversiktLPS = ({
  oppfolgingsplanLPSBistandsbehov,
}: BehandleOppfolgingsplanLPSProps) => {
  const { virksomhetsnavn } = useVirksomhetQuery(
    oppfolgingsplanLPSBistandsbehov.virksomhetsnummer
  );

  return (
    <Box background="surface-default" padding="8" className="mb-2">
      <Heading size="small">{virksomhetsnavn}</Heading>
      <p>
        Mottatt:{" "}
        {restdatoTilLesbarDato(oppfolgingsplanLPSBistandsbehov.opprettet)}
      </p>
      <Tag variant="info" className="mb-4">
        LPS
      </Tag>
      <div className="mb-4">
        <ButtonOpenPlan oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov} />
      </div>
      <BehandleOppfolgingsplanLPS
        oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov}
      />
    </Box>
  );
};

export default OppfolgingsplanerOversiktLPS;
