import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import SykmeldingNokkelOpplysning from "./SykmeldingNokkelOpplysning";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { Egenmeldingsdager } from "./Egenmeldingsdager";

const texts = {
  diagnose: "Diagnose",
  diagnosekode: "Diagnosekode",
};

interface DineKoronaSykmeldingOpplysningerProps {
  sykmelding: SykmeldingOldFormat;
}
const DineKoronaSykmeldingOpplysninger = (
  dineKoronaSykmeldingOpplysningerProps: DineKoronaSykmeldingOpplysningerProps
) => {
  const { sykmelding } = dineKoronaSykmeldingOpplysningerProps;
  return (
    <div className="dine-opplysninger">
      <h2 className="js-din-sykmelding-tittel typo-innholdstittel blokk-l">
        Dine opplysninger
      </h2>
      <div className="blokk-l side-innhold fjern-margin-bottom">
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        <Egenmeldingsdager sykmelding={sykmelding} />
        {sykmelding.diagnose.hoveddiagnose ? (
          <div className="hoveddiagnose">
            <div className="rad-container">
              <SykmeldingNokkelOpplysning
                className="nokkelopplysning--hoveddiagnose"
                tittel={texts.diagnose}
              >
                <div>
                  <p className="js-hoveddiagnose">
                    {sykmelding.diagnose.hoveddiagnose.diagnose}
                  </p>
                </div>
              </SykmeldingNokkelOpplysning>
              <div className="nokkelopplysning nokkelopplysning--hoveddiagnose js-hoveddiagnose-kode-container">
                <div className="medHjelpetekst">
                  <h3 className="nokkelopplysning__tittel">
                    {texts.diagnosekode}
                  </h3>
                </div>
                <p>
                  <span className="js-hoveddiagnose-kode">
                    {sykmelding.diagnose.hoveddiagnose.diagnosekode}
                  </span>
                  &nbsp;
                  <span className="js-hoveddiagnose-system">
                    {sykmelding.diagnose.hoveddiagnose.diagnosesystem}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DineKoronaSykmeldingOpplysninger;
