import React from "react";
import { Field } from "react-final-form";
import Fritekst from "@/components/Fritekst";
import { FlexColumn } from "@/components/Layout";

export const vurderAktivitetskravBeskrivelseMaxLength = 1000;
export const vurderAktivitetskravBeskrivelseFieldName = "beskrivelse";

interface VurderAktivitetskravBeskrivelseProps {
  label?: string;
}

export const VurderAktivitetskravBeskrivelse = ({
  label = "Beskrivelse",
}: VurderAktivitetskravBeskrivelseProps) => {
  return (
    <FlexColumn flex={1}>
      <Field<string> name={vurderAktivitetskravBeskrivelseFieldName}>
        {({ input, meta }) => (
          <Fritekst
            size="stor"
            maxLength={vurderAktivitetskravBeskrivelseMaxLength}
            label={label}
            feil={meta.submitFailed && meta.error}
            id={vurderAktivitetskravBeskrivelseFieldName}
            {...input}
          />
        )}
      </Field>
    </FlexColumn>
  );
};
