import React from "react";
import { useUnntaksstatistikk } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { dagerMellomDatoer, dagerMellomDatoerUtenAbs } from "@/utils/datoUtils";
import styled from "styled-components";
import { Unntaksstatistikk } from "../../../img/ImageComponents";
import { Element, Normaltekst } from "nav-frontend-typografi";

const texts = {
  header: "Din statistikk",
};

const Icon = styled.img`
  margin-right: 1em;
  width: 3em;
`;

const StatistikkWrapper = styled.div`
  display: flex;
  border: 1px solid #6a6a6a;
  padding: 1em;
  border-radius: 0.2em;
  width: 65%;
`;

const DialogmoteunntakSkjemaStatistikk = () => {
  const { data: unntaksstatistikk } = useUnntaksstatistikk();
  if (!unntaksstatistikk) return <></>;

  const total = unntaksstatistikk.filter(
    (value) =>
      dagerMellomDatoerUtenAbs(new Date(value.tilfelleEnd), new Date()) > 16 ||
      dagerMellomDatoerUtenAbs(
        new Date(value.tilfelleStart),
        new Date(value.tilfelleEnd)
      ) >
        30 * 7
  );
  const frisk = total.filter(
    (value) =>
      dagerMellomDatoer(
        new Date(value.tilfelleStart),
        new Date(value.tilfelleEnd)
      ) <=
      30 * 7
  ).length;

  const text = `Du har valgt denne unntaksårsaken ${total.length} ganger tidligere, i ${frisk} av disse tilfellene ble arbeidstakeren friskmeldt innen 28 uker.`;
  return (
    <StatistikkWrapper>
      <Icon src={Unntaksstatistikk} />
      <div>
        <Element>{texts.header}</Element>
        <Normaltekst>{text}</Normaltekst>
      </div>
    </StatistikkWrapper>
  );
};

export default DialogmoteunntakSkjemaStatistikk;
