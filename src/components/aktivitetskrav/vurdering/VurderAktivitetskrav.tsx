import React from "react";
import { FlexRow } from "@/components/Layout";
import { AktivitetskravDTO } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { OppfolgingstilfelleDTO } from "@/data/oppfolgingstilfelle/person/types/OppfolgingstilfellePersonDTO";
import { tilLesbarPeriodeMedArUtenManednavn } from "@/utils/datoUtils";
import { VurderAktivitetskravTabs } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravTabs";
import { BodyShort, Heading, Panel } from "@navikt/ds-react";
import { VurderAktivitetskravButtons } from "@/components/aktivitetskrav/vurdering/VurderAktivitetskravButtons";

export const texts = {
  header: "Vurdere aktivitetskravet",
};

interface VurderAktivitetskravProps {
  aktivitetskrav: AktivitetskravDTO | undefined;
  oppfolgingstilfelle: OppfolgingstilfelleDTO | undefined;
}

export const VurderAktivitetskrav = ({
  aktivitetskrav,
  oppfolgingstilfelle,
}: VurderAktivitetskravProps) => {
  return (
    <Panel className="mb-4 flex flex-col pt-4 pr-4 pb-8 pl-8">
      <VurderAktivitetskravButtons aktivitetskrav={aktivitetskrav} />
      <Heading level="2" size="large">
        {texts.header}
      </Heading>
      {oppfolgingstilfelle && (
        <FlexRow>
          <BodyShort size="small">{`Gjelder tilfelle ${tilLesbarPeriodeMedArUtenManednavn(
            oppfolgingstilfelle.start,
            oppfolgingstilfelle.end
          )}`}</BodyShort>
        </FlexRow>
      )}
      <VurderAktivitetskravTabs aktivitetskrav={aktivitetskrav} />
    </Panel>
  );
};
