import React from "react";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";
import { Knapp } from "nav-frontend-knapper";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import DineKoronaSykmeldingOpplysninger from "../sykmeldingOpplysninger/DineKoronaSykmeldingOpplysninger";
import Hjelpeboble from "../../../../bjorn/Hjelpeboble";
import { PersonImage } from "../../../../../../img/ImageComponents";

const texts = {
  pageSubtitle: "for selvstendig næringsdrivende og frilansere",
  infotext1:
    "Her sjekker du at opplysningene fra når du opprettet egenmeldingen stemmer. Om alt stemmer kan du bekrefte og sende inn egenmeldingen.",
  infoText2:
    "Vennligst se nøye over at opplysningene du har oppgitt er riktige.",
  button: "Gå til utfyllingen",
};

interface KoronaSykmeldingAvbruttProps {
  sykmelding: SykmeldingOldFormat;
}

const KoronaSykmeldingNy = (
  koronaSykmeldingAvbruttProps: KoronaSykmeldingAvbruttProps
) => {
  const { sykmelding } = koronaSykmeldingAvbruttProps;
  return (
    <>
      <Undertittel style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        {texts.pageSubtitle}
      </Undertittel>
      <Hjelpeboble className="blokk" hvit bildeAlt={texts.infotext1}>
        <>
          <Normaltekst style={{ marginBottom: "1rem" }}>
            {texts.infotext1}
          </Normaltekst>
          <Normaltekst>{texts.infoText2}</Normaltekst>
          <div className="skjul-pa-desktop">
            <Knapp mini disabled style={{ marginTop: "2rem" }}>
              {texts.button}
            </Knapp>
          </div>
        </>
      </Hjelpeboble>
      <article>
        <header className="panelHeader panelHeader--lysebla">
          <img className="panelHeader__ikon" src={PersonImage} alt="Du" />
          <h2 className="panelHeader__tittel">
            {sykmelding.pasient.fornavn} {sykmelding.pasient.mellomnavn}{" "}
            {sykmelding.pasient.etternavn}
          </h2>
        </header>
        <div className="panel blokk">
          <DineKoronaSykmeldingOpplysninger sykmelding={sykmelding} />
        </div>
      </article>
    </>
  );
};

export default KoronaSykmeldingNy;
