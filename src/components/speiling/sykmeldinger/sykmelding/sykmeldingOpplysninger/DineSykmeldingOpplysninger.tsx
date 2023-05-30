import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tidligsteFom } from "@/utils/periodeUtils";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingNokkelOpplysning from "./SykmeldingNokkelOpplysning";
import SykmeldingPerioder from "./SykmeldingPerioder";
import { SykmeldingCheckbox } from "./SykmeldingCheckbox";
import FlereOpplysninger from "./flereopplysninger/FlereOpplysninger";
import { SykmeldingCheckboxForFelt } from "./SykmeldingCheckboxForFelt";
import { SpeilingEkspanderbartPanel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanel";
import { SpeilingEkspanderbartPanelTittel } from "@/components/speiling/ekspanderbar/SpeilingEkspanderbartPanelTittel";
import { Egenmeldingsdager } from "./Egenmeldingsdager";

const texts = {
  dinSykmeldingTittel: "Sykmelding\n",
  dinSykmeldingDiagnoseTittel: "Diagnose\n",
  dinSykmeldingBidiagnoseTittel: "Bidiagnose\n",
  yrkesskadeTittel: "Sykdommen kan skyldes en skade/yrkessykdom\n",
  diagnoseMeta: "Diagnosen vises ikke til arbeidsgiveren",
  arbeidsforTittel: "Pasienten er 100 % arbeidsfør etter perioden\n",
  avsenderTittel: "Lege / sykmelder\n",
  flereOpplysningerTittel: "Flere opplysninger fra den som har sykmeldt deg",
  arbeidsgiverTittel: "Arbeidsgiver som legen har skrevet inn",
  hensynTittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen\n",
  svangerskapTittel: "Sykdommen er svangerskapsrelatert\n\n",
};

const getStillingsprosentText = (stillingsprosent?: number) => {
  return `${stillingsprosent} % stilling`;
};

interface DineSykmeldingOpplysningerProps {
  sykmelding: SykmeldingOldFormat;
  Overskrift?: keyof JSX.IntrinsicElements;
}

const DineSykmeldingOpplysninger = (
  dineSykmeldingOpplysningerProps: DineSykmeldingOpplysningerProps
) => {
  const { sykmelding, Overskrift = "h2" } = dineSykmeldingOpplysningerProps;
  return (
    <div className="dine-opplysninger">
      <Overskrift className="js-din-sykmelding-tittel typo-innholdstittel blokk-l">
        {sykmelding.mulighetForArbeid.perioder.some((periode) => {
          return !!periode.avventende;
        })
          ? "Avventende sykmelding"
          : texts.dinSykmeldingTittel}
      </Overskrift>
      <div className="blokk-l side-innhold">
        <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
        <Egenmeldingsdager sykmelding={sykmelding} />
        {sykmelding.diagnose.hoveddiagnose ? (
          <div className="hoveddiagnose">
            <div className="rad-container">
              <SykmeldingNokkelOpplysning
                className="nokkelopplysning--hoveddiagnose"
                tittel={texts.dinSykmeldingDiagnoseTittel}
              >
                <div>
                  <p className="js-hoveddiagnose">
                    {sykmelding.diagnose.hoveddiagnose.diagnose}
                  </p>
                  <p className="js-diagnose-meta nokkelopplysning__meta nokkelopplysning__meta--mobil">
                    {texts.diagnoseMeta}
                  </p>
                </div>
              </SykmeldingNokkelOpplysning>
              <div className="nokkelopplysning nokkelopplysning--hoveddiagnose js-hoveddiagnose-kode-container">
                <div className="medHjelpetekst">
                  <h3 className="nokkelopplysning__tittel">
                    {texts.dinSykmeldingDiagnoseTittel}
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
            <p className="js-diagnose-meta nokkelopplysning__meta nokkelopplysning__meta--desktop">
              {texts.diagnoseMeta}
            </p>
          </div>
        ) : null}
        {sykmelding.diagnose.bidiagnoser &&
          sykmelding.diagnose.bidiagnoser.map((bidiagnose, index) => {
            return (
              <div
                className="rad-container bidiagnose"
                key={`${sykmelding.id}-bidiagnose-${index}`}
              >
                <SykmeldingNokkelOpplysning
                  tittel={texts.dinSykmeldingBidiagnoseTittel}
                >
                  <p className="js-bidiagnose">{bidiagnose.diagnose}</p>
                  <p className="js-bidiagnose-meta nokkelopplysning__meta nokkelopplysning__meta--mobil">
                    {texts.diagnoseMeta}
                  </p>
                  <p className="js-bidiagnose-meta nokkelopplysning__meta nokkelopplysning__meta--desktop">
                    {texts.diagnoseMeta}
                  </p>
                </SykmeldingNokkelOpplysning>
                <SykmeldingNokkelOpplysning
                  tittel={texts.dinSykmeldingDiagnoseTittel}
                >
                  <p>
                    <span className="js-bidiagnose-kode">
                      {bidiagnose.diagnosekode}
                    </span>
                    <span className="js-bidiagnose-system">
                      {bidiagnose.diagnosesystem}
                    </span>
                  </p>
                </SykmeldingNokkelOpplysning>
              </div>
            );
          })}
        {sykmelding.diagnose.fravaersgrunnLovfestet ? (
          <SykmeldingNokkelOpplysning tittel="Lovfestet fraværsgrunn">
            <p className="js-fravaersgrunnLovfestet">
              {sykmelding.diagnose.fravaersgrunnLovfestet}
            </p>
          </SykmeldingNokkelOpplysning>
        ) : null}
        {sykmelding.diagnose.fravaerBeskrivelse ? (
          <SykmeldingNokkelOpplysning tittel="Beskriv fraværet">
            <p className="js-fravaerBeskrivelse">
              {sykmelding.diagnose.fravaerBeskrivelse}
            </p>
          </SykmeldingNokkelOpplysning>
        ) : null}
        <SykmeldingCheckboxForFelt
          sykmeldingBolk={sykmelding.diagnose}
          felt="svangerskap"
          tekst={texts.svangerskapTittel}
          className="blokk"
        />
        {!sykmelding.diagnose.yrkesskadeDato ? null : (
          <SykmeldingCheckbox
            tekst={texts.yrkesskadeTittel}
            jsClassName="yrkesskade"
          />
        )}
        {!sykmelding.diagnose.yrkesskadeDato ? null : (
          <SykmeldingNokkelOpplysning
            tittel="Skadedato"
            className="subopplysning"
          >
            <p className=" js-yrkesskadeDato">
              {tilLesbarDatoMedArstall(sykmelding.diagnose.yrkesskadeDato)}
            </p>
          </SykmeldingNokkelOpplysning>
        )}
        <SykmeldingCheckboxForFelt
          sykmeldingBolk={sykmelding.friskmelding}
          felt="arbeidsfoerEtterPerioden"
          tekst={texts.arbeidsforTittel}
          className="blokk"
        />
        {!sykmelding.friskmelding.hensynPaaArbeidsplassen ? null : (
          <SykmeldingNokkelOpplysning tittel={texts.hensynTittel}>
            <p className="js-hensynPaaArbeidsplassen">
              {sykmelding.friskmelding.hensynPaaArbeidsplassen}
            </p>
          </SykmeldingNokkelOpplysning>
        )}
        {sykmelding.arbeidsgiver ? (
          <SykmeldingNokkelOpplysning tittel={texts.arbeidsgiverTittel}>
            <div>
              <p className="js-arbeidsgiver">{sykmelding.arbeidsgiver}</p>
              {
                // periode-sjekken kan fjernes etter 1.august 2018 (Når sykmeldinger med fom før 26.april uansett ikke vises)
                sykmelding.stillingsprosent &&
                tidligsteFom(sykmelding.mulighetForArbeid.perioder) >=
                  new Date("2018-04-26") ? (
                  <p className="js-stillingsprosent">
                    {getStillingsprosentText(sykmelding.stillingsprosent)}
                  </p>
                ) : null
              }
            </div>
          </SykmeldingNokkelOpplysning>
        ) : null}
        {sykmelding.bekreftelse.sykmelder ? (
          <SykmeldingNokkelOpplysning tittel={texts.avsenderTittel}>
            <p className="js-avsender">{sykmelding.bekreftelse.sykmelder}</p>
          </SykmeldingNokkelOpplysning>
        ) : null}
      </div>
      <SpeilingEkspanderbartPanel
        tittel={
          <SpeilingEkspanderbartPanelTittel icon="lege">
            {texts.flereOpplysningerTittel}
          </SpeilingEkspanderbartPanelTittel>
        }
      >
        <div className="sykmeldingSeksjoner">
          <FlereOpplysninger sykmelding={sykmelding} />
        </div>
      </SpeilingEkspanderbartPanel>
    </div>
  );
};

export default DineSykmeldingOpplysninger;
