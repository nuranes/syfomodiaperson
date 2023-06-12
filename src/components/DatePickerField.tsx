import { useField } from "react-final-form";
import { DateInputProps, DatePicker, useDatepicker } from "@navikt/ds-react";
import React from "react";
import { DatePickerDefaultProps } from "@navikt/ds-react/src/date/datepicker/DatePicker";
import dayjs from "dayjs";

interface DatePickerFieldProps
  extends Pick<
    DateInputProps & DatePickerDefaultProps,
    "size" | "strategy" | "label" | "fromDate" | "toDate"
  > {
  fieldName: string;
  validate?: (value: string | undefined) => string | undefined;
}

export const DatePickerField = ({
  fieldName,
  validate,
  label,
  fromDate,
  toDate,
  size,
  strategy,
}: DatePickerFieldProps) => {
  const { input, meta } = useField<string>(fieldName, { validate });
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      input.onChange(date ? dayjs(date).format("YYYY-MM-DD") : undefined);
    },
    openOnFocus: false,
    fromDate,
    toDate,
  });

  return (
    <DatePicker {...datepickerProps} strategy={strategy}>
      <DatePicker.Input
        size={size}
        id={fieldName}
        label={label}
        error={meta.submitFailed && meta.error}
        {...inputProps}
      />
    </DatePicker>
  );
};
