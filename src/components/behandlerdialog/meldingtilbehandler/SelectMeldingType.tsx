import React from "react";
import { Select, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import { Field } from "react-final-form";

const text = {
  tilleggsopplysinger: "Tilleggsopplysninger L8",
  legeerklaring: "Legeerklæring L40",
  label: "Hvilken meldingstype ønsker du å sende",
  defaultOption: "Velg meldingstype",
};

const field = "type";
export const SelectMeldingType = () => {
  return (
    <Field<string> name={field}>
      {({ input, meta }) => {
        return (
          <>
            <Select
              id={field}
              label={text.label}
              onChange={(e) => input.onChange(e.target.value)}
              defaultValue={""}
            >
              <option value="">{text.defaultOption}</option>
              <option
                value={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
              >
                {text.tilleggsopplysinger}
              </option>
              <option value={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}>
                {text.legeerklaring}
              </option>
            </Select>
            <SkjemaelementFeilmelding>
              {meta.submitFailed && meta.error}
            </SkjemaelementFeilmelding>
          </>
        );
      }}
    </Field>
  );
};
