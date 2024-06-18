import React from "react";
import { FieldArray } from "react-final-form-arrays";
import { NewDialogmotedeltakerAnnenDTO } from "@/data/dialogmote/types/dialogmoteReferatTypes";
import { Field, useFormState } from "react-final-form";
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
        className="flex-[0.3]"
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
    <div className="flex flex-col gap-4 items-start">
      <FieldArray<NewDialogmotedeltakerAnnenDTO> name={"andreDeltakere"}>
        {({ fields }) => (
          <>
            {fields.map((field, index) => (
              <div key={field} className="flex w-full gap-2">
                <DeltakerField
                  fieldName={`${field}.funksjon`}
                  label={texts.funksjonLabel}
                  submitFailed={submitFailed}
                  errors={errors}
                />
                <DeltakerField
                  fieldName={`${field}.navn`}
                  label={texts.navnLabel}
                  submitFailed={submitFailed}
                  errors={errors}
                />
                <Button
                  className="mt-7 self-start"
                  type="button"
                  variant="tertiary"
                  size="small"
                  icon={<TrashIcon title="Slett ikon" />}
                  onClick={() => fields.remove(index)}
                />
              </div>
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
