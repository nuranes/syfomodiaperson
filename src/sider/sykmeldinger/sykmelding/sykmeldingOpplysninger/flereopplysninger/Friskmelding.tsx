import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import SykmeldingOpplysning from "./SykmeldingOpplysning";
import { SykmeldingCheckboxForFelt } from "../SykmeldingCheckboxForFelt";

const texts = {
  title: "Friskmelding/prognose",
  returArbeidsgiver:
    "Jeg antar at pasienten på sikt kan komme tilbake til samme arbeidsgiver",
  returArbeidsgiverDato: "Anslå når du tror dette kan skje",
  returArbeidsgiverAnnen:
    "Jeg antar at pasienten på sikt kan komme i arbeid hos annen arbeidsgiver",
  returUsikker:
    "Jeg er usikker på om pasienten kan komme tilbake i arbeid hos egen eller annen arbeidsgiver",
  returUsikkerDato: "Når antar du å kunne gi tilbakemelding på dette?",
  returUtenArbeidsgiver:
    "Jeg antar at pasienten på sikt kan komme tilbake i arbeid",
  returUtenArbeidsgiverDato: "Anslå når du tror dette kan skje",
  returUtenArbeidsgiverUsikker:
    "Jeg er usikker på om pasienten kan komme tilbake i arbeid",
  returUtenArbeidsgiverUsikkerDato:
    "Når antar du å kunne gi tilbakemelding på dette?",
};

interface FriskmeldingProps {
  sykmelding: SykmeldingOldFormat;
}

const Friskmelding = (friskmeldingProps: FriskmeldingProps) => {
  const { sykmelding } = friskmeldingProps;
  const visSeksjon =
    sykmelding.friskmelding.antarReturSammeArbeidsgiver ||
    sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver ||
    sykmelding.friskmelding.antarReturAnnenArbeidsgiver ||
    sykmelding.friskmelding.tilbakemeldingReturArbeid ||
    sykmelding.friskmelding.utenArbeidsgiverTilbakemelding ||
    sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid ||
    sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato ||
    sykmelding.friskmelding.utenArbeidsgiverTilbakemelding;

  if (!visSeksjon) {
    return <div />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">{texts.title}</h4>
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="antarReturSammeArbeidsgiver"
        tekst={texts.returArbeidsgiver}
        className="typo-element blokk-s"
      />
      {!sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver ? null : (
        <SykmeldingOpplysning
          Overskrift="h5"
          className="subopplysning"
          tittel={texts.returArbeidsgiverDato}
        >
          <p className="opplysning__verdi js-antattDatoReturSammeArbeidsgiver">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.antattDatoReturSammeArbeidsgiver
            )}
          </p>
        </SykmeldingOpplysning>
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="antarReturAnnenArbeidsgiver"
        tekst={texts.returArbeidsgiverAnnen}
        className="typo-element blokk-s"
      />
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="tilbakemeldingReturArbeid"
        tekst={texts.returUsikker}
        className="typo-element blokk-s"
      />
      {!sykmelding.friskmelding.tilbakemeldingReturArbeid ? null : (
        <SykmeldingOpplysning
          className="subopplysning"
          tittel={texts.returUsikkerDato}
        >
          <p className="opplysning__verdi js-tilbakemeldingReturArbeidDato">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.tilbakemeldingReturArbeid
            )}
          </p>
        </SykmeldingOpplysning>
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="utenArbeidsgiverAntarTilbakeIArbeid"
        tekst={texts.returUtenArbeidsgiver}
        className="typo-element blokk-s"
      />
      {!(
        sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeid &&
        sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato
      ) ? null : (
        <SykmeldingOpplysning
          className="subopplysning"
          tittel={texts.returUtenArbeidsgiverDato}
        >
          <p className="opplysning__verdi js-utenArbeidsgiverAntarTilbakeIArbeidDato">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.utenArbeidsgiverAntarTilbakeIArbeidDato
            )}
          </p>
        </SykmeldingOpplysning>
      )}
      <SykmeldingCheckboxForFelt
        sykmeldingBolk={sykmelding.friskmelding}
        felt="utenArbeidsgiverTilbakemelding"
        tekst={texts.returUtenArbeidsgiverUsikker}
        className="typo-element blokk-s"
      />
      {!sykmelding.friskmelding.utenArbeidsgiverTilbakemelding ? null : (
        <SykmeldingOpplysning
          className="subopplysning"
          tittel={texts.returUtenArbeidsgiverUsikkerDato}
        >
          <p className="js-utenArbeidsgiverTilbakemeldingDato">
            {tilLesbarDatoMedArstall(
              sykmelding.friskmelding.utenArbeidsgiverTilbakemelding
            )}
          </p>
        </SykmeldingOpplysning>
      )}
    </div>
  );
};

export default Friskmelding;
