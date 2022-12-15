import { Radio, RadioGruppe } from "nav-frontend-skjema";
import React from "react";
import { Field, useFormState } from "react-final-form";
import { VurderingArsak } from "@/data/aktivitetskrav/aktivitetskravTypes";
import { ArsakText } from "@/data/aktivitetskrav/aktivitetskravTexts";

const texts = {
  arsakLegend: "Årsak (obligatorisk)",
};

export const vurderAktivitetskravArsakFieldName = "arsak";

interface VurderAktivitetskravArsakRadioGruppeProps {
  arsakTexts: ArsakText[];
}

export const VurderAktivitetskravArsakRadioGruppe = ({
  arsakTexts,
}: VurderAktivitetskravArsakRadioGruppeProps) => {
  const { submitFailed, errors } = useFormState();

  return (
    <RadioGruppe
      legend={texts.arsakLegend}
      feil={
        submitFailed && errors && errors[vurderAktivitetskravArsakFieldName]
      }
    >
      {arsakTexts.map(({ arsak, text }, index) => (
        <Field<VurderingArsak>
          key={index}
          name={vurderAktivitetskravArsakFieldName}
          value={arsak}
          type="radio"
        >
          {({ input }) => <Radio {...input} label={text} />}
        </Field>
      ))}
    </RadioGruppe>
  );
};
