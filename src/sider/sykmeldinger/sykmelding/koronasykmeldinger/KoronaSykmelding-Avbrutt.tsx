import React from "react";
import { Undertittel } from "nav-frontend-typografi";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingStatuspanel from "../../sykmeldingstatuspanel/SykmeldingStatuspanel";
import DineKoronaSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

const texts = {
  pageSubtitle: "for selvstendig næringsdrivende og frilansere",
  expandableTitle: "Dine opplysninger",
};

interface KoronaSykmeldingAvbruttProps {
  sykmelding: SykmeldingOldFormat;
}

const KoronaSykmeldingAvbrutt = ({
  sykmelding,
}: KoronaSykmeldingAvbruttProps) => {
  return (
    <div>
      <Undertittel style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        {texts.pageSubtitle}
      </Undertittel>
      <SykmeldingStatuspanel sykmelding={sykmelding} />
      <SpeilingEkspanderbartPanel
        variant="lysebla"
        defaultOpen
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="person">
            {texts.expandableTitle}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <DineKoronaSykmeldingOpplysninger sykmelding={sykmelding} />
      </SpeilingEkspanderbartPanel>
    </div>
  );
};

export default KoronaSykmeldingAvbrutt;
