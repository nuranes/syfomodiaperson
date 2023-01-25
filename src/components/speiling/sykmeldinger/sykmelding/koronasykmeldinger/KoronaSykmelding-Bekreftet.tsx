import React from "react";
import { Undertittel } from "nav-frontend-typografi";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import BekreftetSykmeldingStatuspanel from "../../sykmeldingstatuspanel/BekreftetSykmeldingStatuspanel";
import DineKoronaSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";

const texts = {
  pageSubtitle: "for selvstendig næringsdrivende og frilansere",
  expandableTitle: "Dine opplysninger",
};

interface KoronaSykmeldingBekreftetProps {
  dinSykmelding: SykmeldingOldFormat;
}

const KoronaSykmeldingBekreftet = ({
  dinSykmelding,
}: KoronaSykmeldingBekreftetProps) => {
  return (
    <div>
      <Undertittel style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        {texts.pageSubtitle}
      </Undertittel>
      <BekreftetSykmeldingStatuspanel sykmelding={dinSykmelding} />
      <SpeilingEkspanderbartPanel
        variant="lysebla"
        defaultOpen
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.expandableTitle}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <DineKoronaSykmeldingOpplysninger sykmelding={dinSykmelding} />
      </SpeilingEkspanderbartPanel>
    </div>
  );
};

export default KoronaSykmeldingBekreftet;
