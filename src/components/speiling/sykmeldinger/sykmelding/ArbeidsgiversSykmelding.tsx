import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import ArbeidsgiversSykmeldingOpplysninger from "./ArbeidsgiversSykmeldingOpplysninger";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

interface ArbeidsgiversSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
  Overskrift?: string;
  erApen?: boolean;
}

const texts = {
  tittel: "Dette får arbeidsgiveren din se",
};

const ArbeidsgiversSykmelding = ({
  sykmelding,
  erApen = false,
}: ArbeidsgiversSykmeldingProps) => (
  <SpeilingEkspanderbartPanel
    defaultOpen={erApen}
    variant="lyselilla"
    tittel={
      <SpeilingEkspanderbartPanelTittel icon="lege">
        {texts.tittel}
      </SpeilingEkspanderbartPanelTittel>
    }
  >
    <ArbeidsgiversSykmeldingOpplysninger sykmelding={sykmelding} />
  </SpeilingEkspanderbartPanel>
);

export default ArbeidsgiversSykmelding;
