import React from "react";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { tilLesbarPeriodeMedArstall } from "@/utils/datoUtils";

const texts = {
  title: "Periode",
  daySingle: "Dag",
  dayMultiple: "Dager",
  avventende: "Avventende sykmelding",
  avventendeInspill: "Innspill til arbeidsgiver om tilrettelegging",
  behandlingsdager: "behandlingsdager",
  reisetilskudd: "med reisetilskudd",
  reisetilskuddTitle: "Reisetilskudd",
};

interface SykmeldingPeriodeProps {
  periode: SykmeldingPeriodeDTO;
  antallDager: number;
}

const SykmeldingPeriode = (sykmeldingPeriodeProps: SykmeldingPeriodeProps) => {
  const { periode, antallDager = 1 } = sykmeldingPeriodeProps;
  const dayText = antallDager === 1 ? texts.daySingle : texts.dayMultiple;
  return (
    <div className="nokkelopplysning">
      <h3 className="nokkelopplysning__tittel">{texts.title}</h3>
      <p className="js-periode blokk-xxs">
        <strong>{tilLesbarPeriodeMedArstall(periode.fom, periode.tom)}</strong>{" "}
        &bull; {antallDager}&nbsp;{dayText}
      </p>
      {periode.grad ? (
        <p className="js-grad">
          {periode.grad} % sykmeldt
          {periode.reisetilskudd && periode.grad > 0 && periode.grad < 100
            ? ` ${texts.reisetilskudd}`
            : null}
        </p>
      ) : (
        ""
      )}
      {periode.behandlingsdager ? (
        <p className="js-behandlingsdager">
          {periode.behandlingsdager} {texts.behandlingsdager}
        </p>
      ) : null}
      {periode.reisetilskudd && periode.grad === null ? (
        <p className="js-reisetilskudd">{texts.reisetilskuddTitle}</p>
      ) : null}
      {periode.avventende ? (
        <div className="blokk">
          <p className="js-avventende">{texts.avventende}</p>
        </div>
      ) : null}
      {periode.avventende ? (
        <h4 className="nokkelopplysning__tittel">{texts.avventendeInspill}</h4>
      ) : null}
      {periode.avventende ? <p>{periode.avventende}</p> : ""}
    </div>
  );
};

export default SykmeldingPeriode;
