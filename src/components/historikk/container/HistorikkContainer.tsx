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
import {
  AktivitetskravHistorikkDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { BrukerinfoDTO } from "@/data/navbruker/types/BrukerinfoDTO";
import { useBrukerinfoQuery } from "@/data/navbruker/navbrukerQueryHooks";
import { useAktivitetskravHistorikkQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";

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

const getTextForHistorikk = (
  historikk: AktivitetskravHistorikkDTO,
  person: BrukerinfoDTO
): string => {
  switch (historikk.status) {
    case AktivitetskravStatus.NY:
      return `${person.navn} ble kandidat til aktivitetskravet`;
    case AktivitetskravStatus.NY_VURDERING:
      return `Det ble startet ny vurdering av aktivitetskravet`;
    case AktivitetskravStatus.UNNTAK:
    case AktivitetskravStatus.OPPFYLT:
    case AktivitetskravStatus.STANS:
    case AktivitetskravStatus.IKKE_AKTUELL:
    case AktivitetskravStatus.IKKE_OPPFYLT:
      return `${historikk.vurdertAv} vurderte ${historikk.status} for aktivitetskravet`;
    case AktivitetskravStatus.FORHANDSVARSEL:
      return `Det ble sendt et forhåndsvarsel for aktivitetskravet av ${historikk.vurdertAv}`;
    case AktivitetskravStatus.LUKKET:
      return `Vurderingen av aktivitetskravet ble lukket av systemet`;
    case AktivitetskravStatus.AVVENT:
    case AktivitetskravStatus.AUTOMATISK_OPPFYLT:
      throw new Error("Not supported");
  }
};

const createHistorikkEventsFromAktivitetskrav = (
  aktivitietskravHistorikkDTO: AktivitetskravHistorikkDTO[],
  person: BrukerinfoDTO
): HistorikkEvent[] => {
  return aktivitietskravHistorikkDTO
    .filter(
      (entry) =>
        entry.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT &&
        entry.status !== AktivitetskravStatus.AVVENT
    )
    .map((entry: AktivitetskravHistorikkDTO) => {
      return {
        opprettetAv: entry.vurdertAv ?? undefined,
        tekst: getTextForHistorikk(entry, person),
        tidspunkt: entry.tidspunkt,
        kilde: "AKTIVITETSKRAV",
      };
    });
};

export const HistorikkContainer = (): ReactElement => {
  const { brukerinfo: person } = useBrukerinfoQuery();
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

  const {
    data: aktivitetskravHistorikk,
    isLoading: henterAktivitetskravHistorikk,
    isError: hentingAktivitetskravHistorikkFeilet,
  } = useAktivitetskravHistorikkQuery();

  const henter =
    henterLedere ||
    henterHistorikk ||
    henterTilfeller ||
    henterAktivitetskravHistorikk;
  const hentingFeilet =
    hentingLedereFeilet ||
    hentingHistorikkFeilet ||
    hentingTilfellerFeilet ||
    hentingAktivitetskravHistorikkFeilet;

  const allLedere = useMemo(
    () => [...currentLedere, ...formerLedere],
    [currentLedere, formerLedere]
  );

  const tilfeller = oppfolgingstilfellePerson?.oppfolgingstilfelleList || [];
  const lederHistorikk = createHistorikkEventsFromLedere(allLedere);
  const aktivitetskravHistorikkEvents = createHistorikkEventsFromAktivitetskrav(
    aktivitetskravHistorikk || [],
    person
  );
  const historikkEvents = motebehovHistorikk
    .concat(oppfolgingsplanHistorikk)
    .concat(lederHistorikk)
    .concat(aktivitetskravHistorikkEvents);
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
