import React from "react";
import { Field, useFormState } from "react-final-form";
import { VurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { Radio, RadioGroup } from "@navikt/ds-react";

const texts = {
  arsakLegend: "Årsak (obligatorisk)",
};

export const vurderAktivitetskravArsakFieldName = "arsak";

interface VurderAktivitetskravArsakRadioGruppeProps {
  arsakTexts: VurderingArsakTexts;
}

export const VurderAktivitetskravArsakRadioGruppe = ({
  arsakTexts,
}: VurderAktivitetskravArsakRadioGruppeProps) => {
  const { submitFailed, errors } = useFormState();

  return (
    <RadioGroup
      size="small"
      legend={texts.arsakLegend}
      error={
        submitFailed && errors && errors[vurderAktivitetskravArsakFieldName]
      }
    >
      {Object.entries(arsakTexts).map(([arsak, text], index) => (
        <Field<string>
          key={index}
          name={vurderAktivitetskravArsakFieldName}
          value={arsak}
          type="radio"
        >
          {({ input }) => <Radio {...input}>{text}</Radio>}
        </Field>
      ))}
    </RadioGroup>
  );
};
