import React, { ReactElement } from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingPerioder from "../../sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingPerioder";
import SykmeldingNokkelOpplysning from "../../sykmeldinger/sykmelding/sykmeldingOpplysninger/SykmeldingNokkelOpplysning";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";

const texts = {
  tittel: "Opplysninger fra sykmeldingen",
  arbeidsgiver: "Arbeidsgiver",
  utdrag: "Dato sykmeldingen ble skrevet",
};

interface SykmeldingUtdragProps {
  erApen?: boolean;
  sykmelding: SykmeldingOldFormat;
}

const SykmeldingUtdrag = ({
  erApen,
  sykmelding,
}: SykmeldingUtdragProps): ReactElement => {
  return (
    <div className="blokk">
      <SpeilingEkspanderbartPanel
        variant="lysebla"
        visLukkLenke={!erApen}
        defaultOpen={erApen}
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="plaster">
            {texts.tittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <div>
          <SykmeldingPerioder
            perioder={sykmelding.mulighetForArbeid.perioder}
          />
          <SykmeldingNokkelOpplysning tittel={texts.arbeidsgiver}>
            <p className="js-arbeidsgiver">
              {sykmelding.mottakendeArbeidsgiver?.navn}
            </p>
          </SykmeldingNokkelOpplysning>
          <SykmeldingNokkelOpplysning tittel={texts.utdrag}>
            <p className="js-utstedelsesdato">
              {tilLesbarDatoMedArstall(sykmelding.bekreftelse.utstedelsesdato)}
            </p>
          </SykmeldingNokkelOpplysning>
        </div>
      </SpeilingEkspanderbartPanel>
    </div>
  );
};

export default SykmeldingUtdrag;
