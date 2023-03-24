import React from "react";
import { Field, useFormState } from "react-final-form";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";
import { Checkbox, CheckboxGroup } from "@navikt/ds-react";

const texts = {
  arsakLegend: "Årsak (obligatorisk)",
};

export const vurderAktivitetskravArsakerFieldName = "arsaker";

export const AvventArsakerCheckboxGruppe = () => {
  const { submitFailed, errors } = useFormState();

  return (
    <CheckboxGroup
      size="small"
      legend={texts.arsakLegend}
      error={
        submitFailed && errors && errors[vurderAktivitetskravArsakerFieldName]
      }
    >
      {Object.entries(avventVurderingArsakTexts).map(([arsak, text], index) => (
        <Field<string>
          key={index}
          name={vurderAktivitetskravArsakerFieldName}
          type="checkbox"
          value={arsak}
        >
          {({ input }) => (
            <Checkbox value={input.value} onChange={input.onChange}>
              {text}
            </Checkbox>
          )}
        </Field>
      ))}
    </CheckboxGroup>
  );
};
