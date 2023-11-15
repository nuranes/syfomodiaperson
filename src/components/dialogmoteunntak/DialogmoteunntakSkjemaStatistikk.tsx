import React from "react";
import { dagerMellomDatoer, dagerMellomDatoerUtenAbs } from "@/utils/datoUtils";
import styled from "styled-components";
import { Unntaksstatistikk } from "../../../img/ImageComponents";
import { Element, Normaltekst } from "nav-frontend-typografi";
import { ARBEIDSGIVERPERIODE_DAYS } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { UnntaksstatistikkDTO } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { useDialogmoteUnntaksstatistikkQuery } from "@/data/dialogmotekandidat/dialogmoteunntakQueryHooks";
import { Skeleton } from "@navikt/ds-react";

const texts = {
  header: "Din statistikk",
};

const THIRTY_WEEKS_IN_DAYS = 30 * 7;

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
  margin-bottom: 1em;
`;

const statistikkTekst = (unntaksstatistikk: UnntaksstatistikkDTO[]): string => {
  const total = unntaksstatistikk.filter(
    (value) =>
      dagerMellomDatoerUtenAbs(new Date(value.tilfelleEnd), new Date()) >
        ARBEIDSGIVERPERIODE_DAYS ||
      dagerMellomDatoerUtenAbs(
        new Date(value.tilfelleStart),
        new Date(value.tilfelleEnd)
      ) > THIRTY_WEEKS_IN_DAYS
  );
  const frisk = total.filter(
    (value) =>
      dagerMellomDatoer(
        new Date(value.tilfelleStart),
        new Date(value.tilfelleEnd)
      ) <= THIRTY_WEEKS_IN_DAYS
  ).length;

  return `Du har valgt denne unntaksårsaken ${total.length} ganger tidligere, i ${frisk} av disse tilfellene ble arbeidstakeren friskmeldt innen 28 uker.`;
};

const DialogmoteunntakSkjemaStatistikk = () => {
  const { data: unntaksstatistikk, isInitialLoading } =
    useDialogmoteUnntaksstatistikkQuery();

  if (isInitialLoading) {
    return <Skeleton variant="rectangle" width="70%" height={100} />;
  }

  return !!unntaksstatistikk ? (
    <StatistikkWrapper>
      <Icon src={Unntaksstatistikk} />
      <div>
        <Element>{texts.header}</Element>
        <Normaltekst>{statistikkTekst(unntaksstatistikk)}</Normaltekst>
      </div>
    </StatistikkWrapper>
  ) : null;
};

export default DialogmoteunntakSkjemaStatistikk;
