import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import MulighetForArbeid from "./MulighetForArbeid";
import Friskmelding from "./Friskmelding";
import UtdypendeOpplysninger from "./UtdypendeOpplysninger";
import BedreArbeidsevne from "./BedreArbeidsevne";
import MeldingTilNAV from "./MeldingTilNAV";
import Tilbakedatering from "./Tilbakedatering";
import MeldingTilArbeidsgiver from "./MeldingTilArbeidsgiver";
import AndreSykmeldingOpplysninger from "./AndreSykmeldingOpplysninger";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";

const texts = {
  utstedelsesdato: "Dato sykmeldingen ble skrevet",
};

interface FlereOpplysningerProps {
  sykmelding: SykmeldingOldFormat;
}

const FlereOpplysninger = (flereOpplysningerProps: FlereOpplysningerProps) => {
  const { sykmelding } = flereOpplysningerProps;
  return (
    <div>
      <div className="sykmeldingSeksjon">
        <SykmeldingOpplysningForFelt
          sykmeldingBolk={sykmelding.bekreftelse}
          felt={"utstedelsesdato"}
          tittel={texts.utstedelsesdato}
          opplysning={tilLesbarDatoMedArstall(
            sykmelding.bekreftelse.utstedelsesdato
          )}
          Overskrift={"h4"}
        />
      </div>
      <MulighetForArbeid sykmelding={sykmelding} />
      <Friskmelding sykmelding={sykmelding} />
      <UtdypendeOpplysninger sykmelding={sykmelding} />
      <BedreArbeidsevne sykmelding={sykmelding} />
      <MeldingTilNAV sykmelding={sykmelding} />
      <MeldingTilArbeidsgiver sykmelding={sykmelding} />
      <Tilbakedatering sykmelding={sykmelding} />
      <AndreSykmeldingOpplysninger sykmelding={sykmelding} />
    </div>
  );
};

export default FlereOpplysninger;
