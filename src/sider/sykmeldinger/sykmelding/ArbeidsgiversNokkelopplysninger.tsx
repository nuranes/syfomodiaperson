import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tidligsteFom } from "@/utils/periodeUtils";
import SykmeldingNokkelOpplysning from "./sykmeldingOpplysninger/SykmeldingNokkelOpplysning";
import SykmeldingPerioder from "./sykmeldingOpplysninger/SykmeldingPerioder";
import { SykmeldingCheckboxForFelt } from "./sykmeldingOpplysninger/SykmeldingCheckboxForFelt";
import { SladdImage } from "../../../../img/ImageComponents";

const texts = {
  arbeidsgiver: "Arbeidsgiver som legen har skrevet inn",
  avsenderTittel: "Lege / sykmelder",
  diagnose: "Diagnose",
  diagnoseSkjult: "Diagnosen er skjult for arbeidsgiver",
  arbeidsfor: "Pasienten er 100 % arbeidsfør etter perioden",
  hensynTittel: "Beskriv eventuelle hensyn som må tas på arbeidsplassen",
};

const getStillingsprosentText = (stillingsprosent?: number) => {
  return `${stillingsprosent} % stilling`;
};

interface ArbeidsgiversNokkelopplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

const ArbeidsgiversNokkelopplysninger = (
  arbeidsgiversNokkelopplysningerProps: ArbeidsgiversNokkelopplysningerProps
) => {
  const { sykmelding } = arbeidsgiversNokkelopplysningerProps;
  return (
    <div className="arbeidsgiversSykmelding__nokkelopplysninger">
      <SykmeldingPerioder perioder={sykmelding.mulighetForArbeid.perioder} />
      {!sykmelding.skalViseSkravertFelt ? null : (
        <SykmeldingNokkelOpplysning tittel={texts.diagnose} Overskrift="h4">
          <img
            src={SladdImage}
            className="js-diagnose"
            alt={texts.diagnoseSkjult}
          />
        </SykmeldingNokkelOpplysning>
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="arbeidsfoerEtterPerioden"
        tekst={texts.arbeidsfor}
        className="blokk"
      />
      {!sykmelding.friskmelding.hensynPaaArbeidsplassen ? null : (
        <SykmeldingNokkelOpplysning tittel={texts.hensynTittel} Overskrift="h4">
          <p className="js-hensynPaaArbeidsplassen">
            {sykmelding.friskmelding.hensynPaaArbeidsplassen}
          </p>
        </SykmeldingNokkelOpplysning>
      )}
      {!sykmelding.arbeidsgiver ? null : (
        <SykmeldingNokkelOpplysning tittel={texts.arbeidsgiver} Overskrift="h4">
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
        </SykmeldingNokkelOpplysning>
      )}
      {!sykmelding.bekreftelse.sykmelder ? null : (
        <SykmeldingNokkelOpplysning
          tittel={texts.avsenderTittel}
          Overskrift="h4"
        >
          <p className="js-sykmelder">{sykmelding.bekreftelse.sykmelder}</p>
        </SykmeldingNokkelOpplysning>
      )}
    </div>
  );
};

export default ArbeidsgiversNokkelopplysninger;
