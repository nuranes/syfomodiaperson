import React from "react";
import dayjs from "dayjs";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import { toDatePrettyPrint } from "@/utils/datoUtils";
import { TidStedSkjemaValues } from "@/data/dialogmote/types/skjemaTypes";

export const DialogmoteDato = () => {
  const now = new Date();
  const today = dayjs(now);
  const yearFromToday = today.add(1, "year").toDate();
  const invalidDateMessage = `Vennligst angi en gyldig dato innen ${toDatePrettyPrint(
    yearFromToday
  )}`;

  const { field, fieldState } = useController<TidStedSkjemaValues, "dato">({
    name: "dato",
    rules: {
      required: true,
    },
  });

  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : undefined);
    },
    fromDate: now,
    toDate: yearFromToday,
    defaultSelected: !!field.value ? new Date(field.value) : undefined,
  });

  return (
    <DatePicker {...datepickerProps} strategy="fixed">
      <DatePicker.Input
        id={field.name}
        {...inputProps}
        size="small"
        label="Dato"
        error={fieldState.error && invalidDateMessage}
      />
    </DatePicker>
  );
};
