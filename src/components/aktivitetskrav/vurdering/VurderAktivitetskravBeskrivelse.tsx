import React from "react";
import { Field } from "react-final-form";
import { FlexColumn } from "@/components/Layout";
import { Textarea } from "@navikt/ds-react";

export const vurderAktivitetskravBeskrivelseMaxLength = 1000;
export const vurderAktivitetskravBeskrivelseFieldName = "beskrivelse";

interface VurderAktivitetskravBeskrivelseProps {
  label?: string;
}

export const VurderAktivitetskravBeskrivelse = ({
  label = "Begrunnelse",
}: VurderAktivitetskravBeskrivelseProps) => {
  return (
    <FlexColumn flex={1}>
      <Field<string> name={vurderAktivitetskravBeskrivelseFieldName}>
        {({ input, meta }) => (
          <Textarea
            size="small"
            label={label}
            maxLength={vurderAktivitetskravBeskrivelseMaxLength}
            error={meta.submitFailed && meta.error}
            id={vurderAktivitetskravBeskrivelseFieldName}
            minRows={6}
            {...input}
          />
        )}
      </Field>
    </FlexColumn>
  );
};
