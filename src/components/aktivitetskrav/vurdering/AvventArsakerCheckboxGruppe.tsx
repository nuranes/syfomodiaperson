import { Checkbox, CheckboxGruppe } from "nav-frontend-skjema";
import React from "react";
import { Field, useFormState } from "react-final-form";
import { avventVurderingArsakTexts } from "@/data/aktivitetskrav/aktivitetskravTexts";

const texts = {
  arsakLegend: "Årsak (obligatorisk)",
};

export const vurderAktivitetskravArsakerFieldName = "arsaker";

export const AvventArsakerCheckboxGruppe = () => {
  const { submitFailed, errors } = useFormState();

  return (
    <CheckboxGruppe
      legend={texts.arsakLegend}
      feil={
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
          {({ input }) => <Checkbox {...input} label={text} />}
        </Field>
      ))}
    </CheckboxGruppe>
  );
};
