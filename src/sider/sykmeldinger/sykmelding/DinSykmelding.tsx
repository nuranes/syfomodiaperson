import React from "react";
import { Link } from "react-router-dom";
import Alertstripe from "nav-frontend-alertstriper";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import DineSykmeldingOpplysninger from "./sykmeldingOpplysninger/DineSykmeldingOpplysninger";
import {
  PersonHighContrastImage,
  PersonImage,
} from "../../../../img/ImageComponents";

const texts = {
  eldreSykmeldinger: "Du har eldre sykmeldinger som du bør behandle før denne.",
  eldreSykmeldingerLenke: "Gå til den eldste sykmeldingen.",
  bjorn:
    "Hei, her sjekker du opplysningene fra den som sykmeldte deg. Stemmer det med det dere ble enige om? Du velger selv om du vil bruke sykmeldingen.",
};

interface DinSykmeldingProps {
  sykmelding: SykmeldingOldFormat;
  visEldreSykmeldingVarsel?: boolean;
  eldsteSykmeldingId?: string;
}

const DinSykmelding = (dinSykmeldingProps: DinSykmeldingProps) => {
  const { sykmelding, visEldreSykmeldingVarsel, eldsteSykmeldingId } =
    dinSykmeldingProps;
  return (
    <div>
      {visEldreSykmeldingVarsel && (
        <Alertstripe type="info">
          <p className="sist side-innhold">
            <span>{texts.eldreSykmeldinger} </span>
            <Link to={`/sykefravaer/sykmeldinger/${eldsteSykmeldingId}`}>
              {texts.eldreSykmeldingerLenke}
            </Link>
          </p>
        </Alertstripe>
      )}
      <header className="panelHeader panelHeader--lysebla">
        <img className="panelHeader__ikon" src={PersonImage} alt="Du" />
        <img
          className="panelHeader__ikon panelHeader__ikon--hoykontrast"
          src={PersonHighContrastImage}
          alt="Du"
        />
      </header>
      <div className="panel blokk">
        <DineSykmeldingOpplysninger sykmelding={sykmelding} />
      </div>
    </div>
  );
};

export default DinSykmelding;
