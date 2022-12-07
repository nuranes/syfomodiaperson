import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { AktivitetskravVurderingAlert } from "@/components/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";

const gjelderOppfolgingstilfelle = (
  aktivitetskrav: AktivitetskravDTO,
  oppfolgingstilfelle: OppfolgingstilfelleDTO
): boolean => {
  return (
    aktivitetskrav.stoppunktAt > oppfolgingstilfelle.start &&
    aktivitetskrav.stoppunktAt <= oppfolgingstilfelle.end
  );
};

export const AktivitetskravSide = () => {
  const { hasActiveOppfolgingstilfelle, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();
  const aktivitetskravForOppfolgingstilfelle = data.filter(
    (aktivitetskrav) =>
      hasActiveOppfolgingstilfelle &&
      latestOppfolgingstilfelle &&
      gjelderOppfolgingstilfelle(aktivitetskrav, latestOppfolgingstilfelle)
  );
  const aktivitetskravTilVurdering = aktivitetskravForOppfolgingstilfelle.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT
  );
  const sisteVurdering = aktivitetskravForOppfolgingstilfelle.find(
    (aktivitetskrav) => aktivitetskrav.vurderinger.length > 0
  )?.vurderinger[0];

  return (
    <>
      {sisteVurdering && (
        <AktivitetskravVurderingAlert vurdering={sisteVurdering} />
      )}
      {aktivitetskravTilVurdering && <VurderAktivitetskrav />}
      {/* TODO:
       * Utdrag fra sykefraværet
       * Historikk
       */}
    </>
  );
};
