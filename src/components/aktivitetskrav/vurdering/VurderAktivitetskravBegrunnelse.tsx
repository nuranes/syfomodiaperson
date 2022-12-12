import React from "react";
import { Field } from "react-final-form";
import Fritekst from "@/components/Fritekst";
import { FlexColumn } from "@/components/Layout";

const vurderAktivitetskravBegrunnelseFieldName = "begrunnelse";
const texts = {
  label: "Begrunnelse",
};

export const vurderAktivitetskravBegrunnelseMaxLength = 1000;

export const VurderAktivitetskravBegrunnelse = () => {
  return (
    <FlexColumn flex={1}>
      <Field<string> name={vurderAktivitetskravBegrunnelseFieldName}>
        {({ input, meta }) => (
          <Fritekst
            size="stor"
            maxLength={vurderAktivitetskravBegrunnelseMaxLength}
            label={texts.label}
            feil={meta.submitFailed && meta.error}
            id={vurderAktivitetskravBegrunnelseFieldName}
            {...input}
          />
        )}
      </Field>
    </FlexColumn>
  );
};
