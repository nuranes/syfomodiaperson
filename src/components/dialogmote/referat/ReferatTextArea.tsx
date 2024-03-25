import React, { ReactNode } from "react";
import { Box, Textarea, TextareaProps } from "@navikt/ds-react";
import { Field } from "react-final-form";

interface ReferatTextAreaProps extends TextareaProps {
  field: string;
  infoBox?: ReactNode;
}

export const ReferatTextArea = ({
  field,
  infoBox,
  ...rest
}: ReferatTextAreaProps) => (
  <div className="flex gap-8">
    <div className="flex-1">
      <Field<string> name={field}>
        {({ input, meta }) => (
          <Textarea
            size="small"
            error={meta.submitFailed && meta.error}
            id={field}
            {...input}
            {...rest}
          />
        )}
      </Field>
    </div>
    <div className="flex-[0.5] mt-12">
      {infoBox ? (
        <Box
          borderRadius="medium"
          background="surface-subtle"
          borderColor="border-default"
          padding="4"
          borderWidth="1"
        >
          {infoBox}
        </Box>
      ) : null}
    </div>
  </div>
);
