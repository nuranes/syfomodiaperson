import { Textarea, TextareaProps } from "@navikt/ds-react";
import React, { ForwardedRef } from "react";

const TextareaField = (
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) => (
  <Textarea className="mb-4" size="small" minRows={4} ref={ref} {...props} />
);

export default React.forwardRef(TextareaField);
