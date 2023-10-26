import { Textarea, TextareaProps } from "@navikt/ds-react";
import { FlexColumn } from "@/components/Layout";
import React, { ForwardedRef } from "react";

export const begrunnelseMaxLength = 1000;

const BegrunnelseTextarea = (
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
) => (
  <FlexColumn flex={1}>
    <Textarea
      size="small"
      minRows={6}
      maxLength={begrunnelseMaxLength}
      ref={ref}
      {...props}
    />
  </FlexColumn>
);

export default React.forwardRef(BegrunnelseTextarea);
