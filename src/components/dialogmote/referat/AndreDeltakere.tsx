import React from "react";
import { FieldArray } from "react-final-form-arrays";
import { NewDialogmotedeltakerAnnenDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { Field, useFormState } from "react-final-form";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { ValidationErrors } from "final-form";
import { Button, TextField } from "@navikt/ds-react";
import { PlusIcon, TrashIcon } from "@navikt/aksel-icons";

const texts = {
  buttonText: "Legg til en deltaker",
  funksjonLabel: "Funksjon",
  navnLabel: "Navn",
};

interface DeltakerFieldProps {
  fieldName: string;
  label: string;
  submitFailed: boolean;
  errors: ValidationErrors;
}

const initialDeltaker: NewDialogmotedeltakerAnnenDTO = {
  navn: "",
  funksjon: "",
};

const identityFunction = (value: any) => value;

const DeltakerField = ({
  fieldName,
  label,
  submitFailed,
  errors,
}: DeltakerFieldProps) => (
  <Field<string> name={fieldName} parse={identityFunction}>
    {({ input }) => (
      <TextField
        {...input}
        id={fieldName}
        label={label}
        error={submitFailed && errors && errors[fieldName]}
        type="text"
        size="small"
      />
    )}
  </Field>
);

export const AndreDeltakere = () => {
  const { submitFailed, errors } = useFormState();

  return (
    <div className="mt-4">
      <FieldArray<NewDialogmotedeltakerAnnenDTO> name={"andreDeltakere"}>
        {({ fields }) => (
          <>
            {fields.map((field, index) => (
              <FlexRow key={field} bottomPadding={PaddingSize.SM}>
                <FlexColumn className="mr-4" flex={0.3}>
                  <DeltakerField
                    fieldName={`${field}.funksjon`}
                    label={texts.funksjonLabel}
                    submitFailed={submitFailed}
                    errors={errors}
                  />
                </FlexColumn>
                <FlexColumn className="mr-1" flex={0.3}>
                  <DeltakerField
                    fieldName={`${field}.navn`}
                    label={texts.navnLabel}
                    submitFailed={submitFailed}
                    errors={errors}
                  />
                </FlexColumn>
                <FlexColumn className="mt-7">
                  <Button
                    type="button"
                    variant="tertiary"
                    size="small"
                    icon={<TrashIcon title="Slett ikon" />}
                    onClick={() => fields.remove(index)}
                  />
                </FlexColumn>
              </FlexRow>
            ))}
            <Button
              type="button"
              variant="secondary"
              icon={<PlusIcon title="Pluss ikon" />}
              onClick={() => fields.push(initialDeltaker)}
            >
              {texts.buttonText}
            </Button>
          </>
        )}
      </FieldArray>
    </div>
  );
};
