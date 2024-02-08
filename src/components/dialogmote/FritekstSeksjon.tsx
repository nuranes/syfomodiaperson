import { Field } from "react-final-form";
import React from "react";
import { Button, Textarea } from "@navikt/ds-react";

const texts = {
  forhandsvisning: "Forhåndsvisning",
};

interface FritekstSeksjonProps {
  fieldName: string;
  label: string;
  handlePreviewClick: () => void;
  maxLength: number;
}

const FritekstSeksjon = ({
  fieldName,
  label,
  handlePreviewClick,
  maxLength,
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
    <Button variant="secondary" type="button" onClick={handlePreviewClick}>
      {texts.forhandsvisning}
    </Button>
  </div>
);

export default FritekstSeksjon;
