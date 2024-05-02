import { TextField, TextFieldProps } from "@navikt/ds-react";
import React, { ForwardedRef } from "react";

const texts = {
  label: "Lenke til videomøte (valgfritt)",
};

const DialogmoteVideolink = (
  props: Omit<TextFieldProps, "label" | "size">,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <TextField
    type="text"
    size="small"
    label={texts.label}
    ref={ref}
    {...props}
  />
);

export default React.forwardRef(DialogmoteVideolink);
