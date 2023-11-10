import React from "react";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { VurderAktivitetskravTabs } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravTabs";
import { Heading, Panel } from "@navikt/ds-react";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";
import { GjelderOppfolgingstilfelle } from "@/components/aktivitetskrav/GjelderOppfolgingstilfelle";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO;
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
  oppfolgingstilfelle,
}: VurderAktivitetskravProps) => {
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
