import { Field } from "react-final-form";
import React from "react";
import { Alert, Button, Textarea } from "@navikt/ds-react";

const texts = {
  forhandsvisning: "Forhåndsvisning",
};

interface FritekstSeksjonProps {
  fieldName: string;
  label: string;
  handlePreviewClick: () => void;
  maxLength: number;
  alertText?: string;
}

const FritekstSeksjon = ({
  fieldName,
  label,
  handlePreviewClick,
  maxLength,
  alertText,
}: FritekstSeksjonProps) => (
  <div className="mb-8">
    <div className="mb-4">
      <Field<string> name={fieldName}>
        {({ input, meta }) => (
          <Textarea
            label={label}
            size="small"
            maxLength={maxLength}
            minRows={4}
            error={meta.submitFailed && meta.error}
            id={fieldName}
            {...input}
          />
        )}
      </Field>
    </div>
    {!!alertText && (
      <Alert variant="warning" size="small" className="mb-4 [&>*]:max-w-fit">
        {alertText}
      </Alert>
    )}
    <Button variant="secondary" type="button" onClick={handlePreviewClick}>
      {texts.forhandsvisning}
    </Button>
  </div>
);

export default FritekstSeksjon;
