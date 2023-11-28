import React, { ReactElement, useMemo } from "react";
import Side from "../../../sider/Side";
import Historikk from "../Historikk";
import SideLaster from "../../SideLaster";
import { HistorikkEvent } from "@/data/historikk/types/historikkTypes";
import IngenHistorikk from "../IngenHistorikk";
import { useHistorikk } from "@/data/historikk/historikk_hooks";
import Sidetopp from "../../Sidetopp";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NarmesteLederRelasjonDTO } from "@/data/leder/ledereTypes";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { Menypunkter } from "@/navigation/menypunkterTypes";

const texts = {
  topp: "Logg",
  pageTitle: "Historikk",
  errorTitle: "Du har ikke tilgang til denne tjenesten",
};

const createHistorikkEventsFromLedere = (
  ledere: NarmesteLederRelasjonDTO[]
): HistorikkEvent[] => {
  return ledere.map((leder) => ({
    opprettetAv: leder.virksomhetsnavn,
    tekst: `${leder.virksomhetsnavn} har oppgitt ${leder.narmesteLederNavn} som nærmeste leder`,
    tidspunkt: leder.aktivFom,
    kilde: "LEDER",
  }));
};

export const HistorikkContainer = (): ReactElement => {
  const {
    henterHistorikk,
    hentingHistorikkFeilet,
    motebehovHistorikk,
    oppfolgingsplanHistorikk,
  } = useHistorikk();

  const {
    isLoading: henterLedere,
    isError: hentingLedereFeilet,
    currentLedere,
    formerLedere,
  } = useLedereQuery();

  const {
    data: oppfolgingstilfellePerson,
    isLoading: henterTilfeller,
    isError: hentingTilfellerFeilet,
  } = useOppfolgingstilfellePersonQuery();

  const henter = henterLedere || henterHistorikk || henterTilfeller;
  const hentingFeilet =
    hentingLedereFeilet || hentingHistorikkFeilet || hentingTilfellerFeilet;

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );

  const tilfeller = oppfolgingstilfellePerson?.oppfolgingstilfelleList || [];
  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);
  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk);
  const ingenHistorikk = tilfeller.length === 0 || historikkEvents.length === 0;

  return (
    <Side tittel={texts.pageTitle} aktivtMenypunkt={Menypunkter.HISTORIKK}>
      <SideLaster henter={henter} hentingFeilet={hentingFeilet}>
        <Sidetopp tittel={texts.topp} />
        {ingenHistorikk ? (
          <IngenHistorikk />
        ) : (
          <Historikk historikkEvents={historikkEvents} tilfeller={tilfeller} />
        )}
      </SideLaster>
    </Side>
  );
};

export default HistorikkContainer;
