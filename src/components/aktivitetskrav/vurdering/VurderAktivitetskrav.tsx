import React from "react";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { VurderAktivitetskravTabs } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravTabs";
import { Heading, Panel } from "@navikt/ds-react";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { GjelderOppfolgingstilfelle } from "@/components/aktivitetskrav/GjelderOppfolgingstilfelle";
import { oppfolgingstilfelleForAktivitetskrav } from "@/utils/aktivitetskravUtils";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

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

  return (
    <Panel className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8">
      <VurderAktivitetskravButtons aktivitetskrav={aktivitetskrav} />
      <Heading level="2" size="large" className="mb-1">
        {texts.header}
      </Heading>
      {oppfolgingstilfelle && (
        <GjelderOppfolgingstilfelle oppfolgingstilfelle={oppfolgingstilfelle} />
      )}
      <VurderAktivitetskravTabs aktivitetskrav={aktivitetskrav} />
    </Panel>
  );
};
