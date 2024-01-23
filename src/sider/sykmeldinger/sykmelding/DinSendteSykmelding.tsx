import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import ArbeidsgiversSykmelding from "./ArbeidsgiversSykmelding";
import DineSykmeldingOpplysninger from "./sykmeldingOpplysninger/DineSykmeldingOpplysninger";
import SykmeldingStatuspanel from "../sykmeldingstatuspanel/SykmeldingStatuspanel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

const texts = {
  tittel: "Dine opplysinger",
};

interface DinSendteSykmeldingProps {
  dinSykmelding: SykmeldingOldFormat;
  arbeidsgiversSykmelding: SykmeldingOldFormat;
}

const DinSendteSykmelding = ({
  dinSykmelding,
  arbeidsgiversSykmelding,
}: DinSendteSykmeldingProps) => {
  return (
    <div>
      <SykmeldingStatuspanel sykmelding={dinSykmelding} />
      <SpeilingEkspanderbartPanel
        defaultOpen
        variant="lysebla"
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.tittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <DineSykmeldingOpplysninger sykmelding={dinSykmelding} />
      </SpeilingEkspanderbartPanel>
      <div className="blokk--l">
        <ArbeidsgiversSykmelding sykmelding={arbeidsgiversSykmelding} />
      </div>
    </div>
  );
};

export default DinSendteSykmelding;
