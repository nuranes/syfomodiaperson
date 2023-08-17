import React from "react";
import { Select, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { MeldingType } from "@/data/behandlerdialog/behandlerdialogTypes";
import { Field } from "react-final-form";
import { meldingTypeTexts } from "@/data/behandlerdialog/behandlerdialogTexts";

const text = {
  label: "Hvilken meldingstype ønsker du å sende?",
  defaultOption: "Velg meldingstype",
};

const field = "type";

const MeldingTypeOption = ({ type }: { type: MeldingType }) => (
  <option value={type}>{meldingTypeTexts[type]}</option>
);

export const SelectMeldingType = () => (
  <Field<string> name={field}>
    {({ input, meta }) => (
      <>
        <Select
          id={field}
          label={text.label}
          onChange={(e) => input.onChange(e.target.value)}
          defaultValue={""}
        >
          <option value="">{text.defaultOption}</option>
          <MeldingTypeOption
            type={MeldingType.FORESPORSEL_PASIENT_TILLEGGSOPPLYSNINGER}
          />
          <MeldingTypeOption
            type={MeldingType.FORESPORSEL_PASIENT_LEGEERKLARING}
          />
        </Select>
        <SkjemaelementFeilmelding>
          {meta.submitFailed && meta.error}
        </SkjemaelementFeilmelding>
      </>
    )}
  </Field>
);
