import React, { ReactElement } from "react";
import { getDuration } from "@/utils/datoUtils";
import { SykmeldingPeriodeDTO } from "@/data/sykmelding/types/SykmeldingOldFormat";
import { firstLetterToUpperCase } from "@/utils/stringUtils";

const textBehandlingsdagEnDag = (behandlingsdager: number, dager: number) => {
  return `${behandlingsdager} behandlingsdag i løpet av ${dager} dag\n`;
};

const textBehandlingsdager = (behandlingsdager: number, dager: number) => {
  return `${behandlingsdager} behandlingsdager i løpet av ${dager} dager\n`;
};

const textEnDagIngenGrad = (behandlingsdager: number) => {
  return `${behandlingsdager} behandlingsdager\n`;
};

const textReisetilskuddEnDag = (dager: number) => {
  return `Reisetilskudd i ${dager} dag\n`;
};

const textReisetilskudd = (dager: number) => {
  return `Reisetilskudd i ${dager} dager\n`;
};

const textReisetilskuddGradert = (grad: number, dager: number) => {
  return `${grad} % sykmelding med reisetilskudd i ${dager} dager\n`;
};

const textAvventende = (arbeidsgiver: string, dager: number) => {
  return `Avventende sykmelding fra ${arbeidsgiver} i ${dager} dager`;
};

const textAvventendeEnDag = (arbeidsgiver: string, dager: number) => {
  return `Avventende sykmelding fra ${arbeidsgiver} i ${dager} dag`;
};

const textAvventendeEnDagUtenArbeidsgiver = (dager: number) => {
  return `Avventende sykemelding i ${dager} dag\n`;
};

const textAvventendeUtenArbeidsgiver = (dager: number) => {
  return `Avventende sykemelding i ${dager} dager\n`;
};

const textDefaultArbeidsgiver = (arbeidsgiver?: string) => {
  return arbeidsgiver ? ` sykmeldt fra ${arbeidsgiver}` : "";
};

const textDefaultDager = (dager: number) => {
  return dager === 1 ? ` i ${dager} dag` : ` i ${dager} dager`;
};

const textDefault = (dager: number, arbeidsgiver?: string, grad?: number) => {
  const textArbeidsgiver = textDefaultArbeidsgiver(arbeidsgiver);
  const textDager = textDefaultDager(dager);
  const text = `${textArbeidsgiver}${textDager}`;
  return grad ? `${grad} %${text}` : `${firstLetterToUpperCase(text.trim())}`;
};

interface SykmeldingPeriodeInfoProps {
  periode: SykmeldingPeriodeDTO;
  arbeidsgiver?: string;
  Element?: keyof JSX.IntrinsicElements;
}

const sykmeldingPeriodeTekst = (
  periode: SykmeldingPeriodeDTO,
  arbeidsgiver?: string
): string => {
  const antallDager = getDuration(periode.fom, periode.tom);
  const sykmeldtEnDag = antallDager === 1;
  const sykmeldtEnDagIngenGrad = sykmeldtEnDag && periode.grad === undefined;

  if (periode.avventende) {
    if (arbeidsgiver === undefined) {
      return sykmeldtEnDag
        ? textAvventendeEnDagUtenArbeidsgiver(antallDager)
        : textAvventendeUtenArbeidsgiver(antallDager);
    } else {
      return sykmeldtEnDag
        ? textAvventendeEnDag(arbeidsgiver, antallDager)
        : textAvventende(arbeidsgiver, antallDager);
    }
  } else if (periode.reisetilskudd) {
    if (periode.grad && periode.grad !== 100) {
      return textReisetilskuddGradert(periode.grad, antallDager);
    } else if (sykmeldtEnDag) {
      return textReisetilskuddEnDag(antallDager);
    } else {
      return textReisetilskudd(antallDager);
    }
  } else if (periode.behandlingsdager && periode.behandlingsdager > 1) {
    return sykmeldtEnDagIngenGrad
      ? textEnDagIngenGrad(periode.behandlingsdager)
      : textBehandlingsdager(periode.behandlingsdager, antallDager);
  } else if (periode.behandlingsdager === 1 && sykmeldtEnDagIngenGrad) {
    return textBehandlingsdagEnDag(periode.behandlingsdager, antallDager);
  } else {
    return textDefault(antallDager, arbeidsgiver, periode.grad);
  }
};

const SykmeldingPeriodeInfo = ({
  periode,
  arbeidsgiver,
  Element = "p",
}: SykmeldingPeriodeInfoProps): ReactElement => {
  const text = sykmeldingPeriodeTekst(periode, arbeidsgiver);

  return <Element>{text}</Element>;
};

export default SykmeldingPeriodeInfo;
