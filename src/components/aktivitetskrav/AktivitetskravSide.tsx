import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { AktivitetskravVurderingAlert } from "@/components/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { AktivitetskravHistorikk } from "@/components/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { Panel } from "@navikt/ds-react";
import { StartNyVurdering } from "./vurdering/StartNyVurdering";
import { AktivitetskravAlertstripe } from "@/components/aktivitetskrav/AktivitetskravAlertstripe";
import { ForhandsvarselOppsummering } from "@/components/aktivitetskrav/vurdering/ForhandsvarselOppsummering";

const texts = {
  noTilfelle:
    "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.",
};

export const AktivitetskravSide = () => {
  const { hasActiveOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskrav = data[0];
  const sisteVurdering = aktivitetskrav?.vurderinger[0];
  const showStartNyVurdering = !aktivitetskrav || aktivitetskrav.inFinalState;

  return (
    <>
      {!hasActiveOppfolgingstilfelle && (
        <AktivitetskravAlertstripe variant="warning" size="small">
          {texts.noTilfelle}
        </AktivitetskravAlertstripe>
      )}
      {sisteVurdering && (
        <AktivitetskravVurderingAlert vurdering={sisteVurdering} />
      )}
      {sisteVurdering?.varsel && (
        <ForhandsvarselOppsummering
          varsel={sisteVurdering.varsel}
          beskrivelse={sisteVurdering.beskrivelse}
        />
      )}
      {showStartNyVurdering ? (
        <StartNyVurdering aktivitetskrav={aktivitetskrav} />
      ) : (
        <VurderAktivitetskrav aktivitetskrav={aktivitetskrav} />
      )}
      <Panel className="mb-4 flex flex-col p-8">
        <UtdragFraSykefravaeret />
      </Panel>
      <AktivitetskravHistorikk />
    </>
  );
};
