import React from "react";
import styled from "styled-components";
import Panel from "nav-frontend-paneler";
import { restdatoTilLesbarDato } from "@/utils/datoUtils";
import { OppfolgingsplanLPS } from "@/data/oppfolgingsplan/types/OppfolgingsplanLPS";
import BehandleOppfolgingsplanLPS from "./BehandleOppfolgingsplanLPS";
import OppfolgingsplanLPSEtikett from "./OppfolgingsplanLPSEtikett";
import { SYFOOPPFOLGINGSPLANSERVICE_ROOT } from "@/apiConstants";
import { useVirksomhetQuery } from "@/data/virksomhet/virksomhetQueryHooks";

const texts = {
  buttonOpenPlan: "Åpne oppfølgingsplanen(pdf)",
};

const UnderTittelInline = styled.h3`
  display: inline-block;
`;

const DivMarginBottom = styled.div`
  margin-bottom: 1em;
`;

const LPSPlanPanel = styled(Panel)`
  margin-bottom: 0.5em;
  padding: 2em 4em 2em 2em;
`;

interface ButtonOpenPlanProps {
  oppfolgingsplanLPS: OppfolgingsplanLPS;
}

export const ButtonOpenPlan = (buttonOpenPlanProps: ButtonOpenPlanProps) => {
  return (
    <a
      className="lenke"
      href={`${SYFOOPPFOLGINGSPLANSERVICE_ROOT}/dokument/lps/${buttonOpenPlanProps.oppfolgingsplanLPS.uuid}`}
      download="oppfølgingsplan"
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
    <LPSPlanPanel>
      <UnderTittelInline className="panel__tittel">
        {virksomhetsnavn}
      </UnderTittelInline>
      <p>
        Mottatt:{" "}
        {restdatoTilLesbarDato(oppfolgingsplanLPSBistandsbehov.opprettet)}
      </p>
      <DivMarginBottom>
        <OppfolgingsplanLPSEtikett />
      </DivMarginBottom>
      <DivMarginBottom>
        <ButtonOpenPlan oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov} />
      </DivMarginBottom>
      <BehandleOppfolgingsplanLPS
        oppfolgingsplanLPS={oppfolgingsplanLPSBistandsbehov}
      />
    </LPSPlanPanel>
  );
};

export default OppfolgingsplanerOversiktLPS;
