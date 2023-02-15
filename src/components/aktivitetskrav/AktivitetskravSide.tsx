import React from "react";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { VurderAktivitetskrav } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskrav";
import { useAktivitetskravQuery } from "@/data/aktivitetskrav/aktivitetskravQueryHooks";
import { AktivitetskravStatus } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { AktivitetskravVurderingAlert } from "@/components/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import UtdragFraSykefravaeret from "@/components/utdragFraSykefravaeret/UtdragFraSykefravaeret";
import { AktivitetskravHistorikk } from "@/components/aktivitetskrav/historikk/AktivitetskravHistorikk";
import { AktivitetskravPanel } from "@/components/aktivitetskrav/AktivitetskravPanel";
import {
  aktivitetskravVurderingerForOppfolgingstilfelle,
  oppfolgingstilfelleForAktivitetskrav,
} from "@/utils/aktivitetskravUtils";
import { AktivitetskravAlertstripe } from "@/components/aktivitetskrav/AktivitetskravAlertstripe";

const texts = {
  vurderArbeidsforhold:
    "Aktivitetskravvurderingen skal gjøres per sykefravær. Eksempel: Hvis personen er 100% sykmeldt fra to arbeidsforhold, må det gjøres to individuelle vurderinger.",
  noTilfelle:
    "Vi finner ingen aktiv sykmelding på denne personen. Du kan likevel vurdere aktivitetskravet hvis det er behov for det.",
};

export const AktivitetskravSide = () => {
  const { tilfellerDescendingStart, hasActiveOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const { data } = useAktivitetskravQuery();

  const aktivitetskravTilVurdering = data.find(
    (aktivitetskrav) =>
      aktivitetskrav.status !== AktivitetskravStatus.AUTOMATISK_OPPFYLT
  );
  const oppfolgingstilfelle =
    aktivitetskravTilVurdering &&
    oppfolgingstilfelleForAktivitetskrav(
      aktivitetskravTilVurdering,
      tilfellerDescendingStart
    );
  const sisteVurdering = oppfolgingstilfelle
    ? aktivitetskravVurderingerForOppfolgingstilfelle(
        data,
        oppfolgingstilfelle
      )[0]
    : aktivitetskravTilVurdering?.vurderinger[0];

  return (
    <>
      <AktivitetskravAlertstripe type="info">
        {texts.vurderArbeidsforhold}
      </AktivitetskravAlertstripe>
      {!hasActiveOppfolgingstilfelle && (
        <AktivitetskravAlertstripe type="advarsel">
          {texts.noTilfelle}
        </AktivitetskravAlertstripe>
      )}
      {sisteVurdering && (
        <AktivitetskravVurderingAlert vurdering={sisteVurdering} />
      )}
      <VurderAktivitetskrav
        aktivitetskrav={aktivitetskravTilVurdering}
        oppfolgingstilfelle={oppfolgingstilfelle}
      />
      <AktivitetskravPanel>
        <UtdragFraSykefravaeret />
      </AktivitetskravPanel>
      <AktivitetskravHistorikk />
    </>
  );
};
