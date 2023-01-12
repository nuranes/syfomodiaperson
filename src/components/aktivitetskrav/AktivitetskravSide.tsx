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
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { AktivitetskravHistorikk } from "@/components/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";

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
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskravTilVurdering = data.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT
  );
  const oppfolgingstilfelle =
    aktivitetskravTilVurdering &&
    tilfellerDescendingStart.find((tilfelle) =>
      gjelderOppfolgingstilfelle(aktivitetskravTilVurdering, tilfelle)
    );
  const vurderteAktivitetskravForOppfolgingstilfelle =
    oppfolgingstilfelle &&
    data.filter(
      (aktivitetskrav) =>
        gjelderOppfolgingstilfelle(aktivitetskrav, oppfolgingstilfelle) &&
        aktivitetskrav.vurderinger.length > 0
    );
  const sisteVurdering = vurderteAktivitetskravForOppfolgingstilfelle?.flatMap(
    (aktivitetskrav) => aktivitetskrav.vurderinger
  )[0];

  return (
    <>
      {sisteVurdering && (
        <AktivitetskravVurderingAlert vurdering={sisteVurdering} />
      )}
      {aktivitetskravTilVurdering && oppfolgingstilfelle && (
        <VurderAktivitetskrav
          aktivitetskrav={aktivitetskravTilVurdering}
          oppfolgingstilfelle={oppfolgingstilfelle}
        />
      )}
      <AktivitetskravPanel>
        <UtdragFraSykefravaeret />
      </AktivitetskravPanel>
      <AktivitetskravHistorikk />
    </>
  );
};
