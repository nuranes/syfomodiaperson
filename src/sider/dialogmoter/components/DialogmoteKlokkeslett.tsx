import { TextField, TextFieldProps } from "@navikt/ds-react";
import React, { ForwardedRef } from "react";

const texts = {
  label: "Klokkeslett",
};

const DialogmoteKlokkeslett = (
  props: Omit<TextFieldProps, "label" | "size">,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <TextField
    type="time"
    autoComplete="off"
    size="small"
    label={texts.label}
    ref={ref}
    {...props}
  />
);

export default React.forwardRef(DialogmoteKlokkeslett);
