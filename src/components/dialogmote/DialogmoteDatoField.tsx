import React from "react";
import { Field } from "react-final-form";
import { Datepicker } from "nav-datovelger";
import dayjs from "dayjs";
import { Label, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { validerDato } from "@/utils/valideringUtils";

const texts = {
  datoLabel: "Dato",
  datoPlaceholder: "dd.mm.åååå",
};

const DialogmoteDatoField = () => {
  const datoField = "dato";
  const now = new Date();
  const today = dayjs(now);
  const yearFromToday = today.add(1, "year");
  const dateFormat = "YYYY-MM-DD";

  return (
    <>
      <Label htmlFor={datoField}>{texts.datoLabel}</Label>
      <Field
        name={datoField}
        id={datoField}
        validate={(value) => validerDato(value, now, yearFromToday.toDate())}
      >
        {({ input, meta }) => (
          <>
            <Datepicker
              inputId={datoField}
              limitations={{
                minDate: today.format(dateFormat),
                maxDate: yearFromToday.format(dateFormat),
              }}
              {...input}
              inputProps={{
                placeholder: texts.datoPlaceholder,
                "aria-invalid": meta.submitFailed && meta.error !== undefined,
              }}
            />
            <SkjemaelementFeilmelding>
              {meta.submitFailed && meta.error}
            </SkjemaelementFeilmelding>
          </>
        )}
      </Field>
    </>
  );
};
export default DialogmoteDatoField;
