import React from "react";
import { Field } from "react-final-form";
import Fritekst from "@/components/Fritekst";
import { FlexColumn } from "@/components/Layout";

const texts = {
  label: "Beskrivelse",
};

export const vurderAktivitetskravBeskrivelseMaxLength = 1000;
export const vurderAktivitetskravBeskrivelseFieldName = "beskrivelse";

export const VurderAktivitetskravBeskrivelse = () => {
  return (
    <FlexColumn flex={1}>
      <Field<string> name={vurderAktivitetskravBeskrivelseFieldName}>
        {({ input, meta }) => (
          <Fritekst
            size="stor"
            maxLength={vurderAktivitetskravBeskrivelseMaxLength}
            label={texts.label}
            feil={meta.submitFailed && meta.error}
            id={vurderAktivitetskravBeskrivelseFieldName}
            {...input}
          />
        )}
      </Field>
    </FlexColumn>
  );
};
