import React, { ReactElement } from "react";
import { useArbeidsuforhetVurderingQuery } from "@/data/arbeidsuforhet/arbeidsuforhetQueryHooks";
import { Alert } from "@navikt/ds-react";
import { VurderingType } from "@/data/arbeidsuforhet/arbeidsuforhetTypes";
import { OppfyltForm } from "@/sider/arbeidsuforhet/OppfyltForm";

const texts = {
  success:
    "Vurderingen om at bruker oppfyller § 8-4 er lagret i historikken og blir journalført automatisk.",
  error:
    "Trykk på 'Arbeidsuførhet'-menypunktet for å komme til skjema for forhåndsvarsel.",
};

export const ArbeidsuforhetOppfylt = (): ReactElement => {
  const { data } = useArbeidsuforhetVurderingQuery();
  const sisteVurdering = data[0];
  const isForhandsvarsel =
    sisteVurdering?.type === VurderingType.FORHANDSVARSEL;
  const isOppfylt = sisteVurdering?.type === VurderingType.OPPFYLT;
  const isAvslag = sisteVurdering?.type === VurderingType.AVSLAG;

  return (
    <div>
      {isForhandsvarsel && <OppfyltForm />}
      {isOppfylt && (
        <Alert variant="success" className="mb-2">
          {texts.success}
        </Alert>
      )}
      {isAvslag && (
        <Alert variant="error" className="mb-2">
          {texts.error}
        </Alert>
      )}
    </div>
  );
};
