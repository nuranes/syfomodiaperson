import React from "react";
import {
  AktivitetskravDTO,
  AktivitetskravStatus,
} from "@/data/aktivitetskrav/aktivitetskravTypes";
import { VurderAktivitetskravTabs } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskravTabs";
import { Heading, Panel } from "@navikt/ds-react";
import { VurderAktivitetskravButtons } from "@/sider/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { GjelderOppfolgingstilfelle } from "@/sider/aktivitetskrav/GjelderOppfolgingstilfelle";
import { oppfolgingstilfelleForAktivitetskrav } from "@/utils/aktivitetskravUtils";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { AktivitetskravVurderingAlert } from "@/sider/aktivitetskrav/vurdering/AktivitetskravVurderingAlert";
import { ForhandsvarselOppsummering } from "@/sider/aktivitetskrav/vurdering/ForhandsvarselOppsummering";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
}: VurderAktivitetskravProps) => {
  const { tilfellerDescendingStart } = useOppfolgingstilfellePersonQuery();
  const oppfolgingstilfelle = oppfolgingstilfelleForAktivitetskrav(
    aktivitetskrav,
    tilfellerDescendingStart
  );
  const currentVurdering = aktivitetskrav.vurderinger[0];
  const showVurderAktivitetskravAlert =
    currentVurdering?.status === AktivitetskravStatus.AVVENT ||
    currentVurdering?.status === AktivitetskravStatus.FORHANDSVARSEL;

  return (
    <>
      {showVurderAktivitetskravAlert && (
        <AktivitetskravVurderingAlert vurdering={currentVurdering} />
      )}
      {currentVurdering?.varsel && (
        <ForhandsvarselOppsummering
          varsel={currentVurdering.varsel}
          beskrivelse={currentVurdering.beskrivelse}
        />
      )}
      <Panel className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8">
        <VurderAktivitetskravButtons aktivitetskrav={aktivitetskrav} />
        <Heading level="2" size="large" className="mb-1">
          {texts.header}
        </Heading>
        {oppfolgingstilfelle && (
          <GjelderOppfolgingstilfelle
            oppfolgingstilfelle={oppfolgingstilfelle}
          />
        )}
        <VurderAktivitetskravTabs aktivitetskrav={aktivitetskrav} />
      </Panel>
    </>
  );
};
