import React from "react";
import { Field } from "react-final-form";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { Datepicker, isISODateString } from "nav-datovelger";
import dayjs from "dayjs";
import { Label, SkjemaelementFeilmelding } from "nav-frontend-skjema";

const texts = {
  datoLabel: "Dato",
  datoPlaceholder: "dd.mm.åååå",
};

export const validerDatoField = (
  value: string | undefined,
  minDate?: Date,
  maxDate?: Date
) => {
  minDate?.setHours(0, 0, 0, 0);
  maxDate?.setHours(23, 59, 59, 999);
  if (!value) {
    return "Vennligst angi dato";
  } else if (!isISODateString(value)) {
    return "Datoen er ikke gyldig eller har ikke riktig format (dd.mm.åååå)";
  } else if (minDate && new Date(value) < minDate) {
    return `Datoen må være etter ${toDatePrettyPrint(minDate)}`;
  } else if (maxDate && new Date(value) > maxDate) {
    return `Datoen må være før ${toDatePrettyPrint(maxDate)}`;
  } else {
    return undefined;
  }
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
        validate={(value) =>
          validerDatoField(value, now, yearFromToday.toDate())
        }
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
