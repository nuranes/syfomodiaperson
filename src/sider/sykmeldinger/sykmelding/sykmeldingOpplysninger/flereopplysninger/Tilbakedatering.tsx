import React from "react";
import { SykmeldingOldFormat } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarDatoMedArstall } from "@/utils/datoUtils";
import { SykmeldingOpplysningForFelt } from "./SykmeldingOpplysningForFelt";

const texts = {
  begrunnelse: "Pasienten har ikke kunne ivareta egne interesser. Begrunn",
  dokumenterbarPasientkontakt:
    "Oppgi dato for dokumenterbar kontakt med pasienten",
  title: "Tilbakedatering",
};

interface TilbakedateringProps {
  sykmelding: SykmeldingOldFormat;
}

const Tilbakedatering = (tilbakedateringProps: TilbakedateringProps) => {
  const { sykmelding } = tilbakedateringProps;
  const visSeksjon =
    sykmelding.tilbakedatering.dokumenterbarPasientkontakt ||
    sykmelding.tilbakedatering.tilbakedatertBegrunnelse;
  if (!visSeksjon) {
    return <span />;
  }
  return (
    <div className="sykmeldingSeksjon">
      <h4 className="sykmeldingSeksjon__tittel">{texts.title}</h4>
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.tilbakedatering}
        felt="dokumenterbarPasientkontakt"
        tittel={texts.dokumenterbarPasientkontakt}
        opplysning={tilLesbarDatoMedArstall(
          sykmelding.tilbakedatering.dokumenterbarPasientkontakt
        )}
      />
      <SykmeldingOpplysningForFelt
        sykmeldingBolk={sykmelding.tilbakedatering}
        felt="tilbakedatertBegrunnelse"
        tittel={texts.begrunnelse}
      />
    </div>
  );
};

export default Tilbakedatering;
