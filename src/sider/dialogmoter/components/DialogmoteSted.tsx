import { TextField, TextFieldProps } from "@navikt/ds-react";
import React, { ForwardedRef } from "react";

export const MAX_LENGTH_STED = 200;

const texts = {
  label: "Sted",
  description: "F.eks: På arbeidsplassen",
};

const DialogmoteSted = (
  props: Omit<TextFieldProps, "label" | "description" | "maxLength" | "size">,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <TextField
    type="text"
    size="small"
    ref={ref}
    maxLength={MAX_LENGTH_STED}
    label={texts.label}
    description={texts.description}
    {...props}
  />
);

export default React.forwardRef(DialogmoteSted);
