import { useField } from "react-final-form";
import {
  DateInputProps,
  UNSAFE_DatePicker,
  UNSAFE_useDatepicker,
} from "@navikt/ds-react";
import React from "react";
import { DatePickerDefaultProps } from "@navikt/ds-react/src/date/datepicker/DatePicker";
import dayjs from "dayjs";

interface DatePickerFieldProps
  extends Pick<
    DateInputProps & DatePickerDefaultProps,
    "size" | "strategy" | "label" | "fromDate" | "toDate"
  > {
  fieldName: string;
}

export const DatePickerField = ({
  fieldName,
  label,
  fromDate,
  toDate,
  size,
  strategy,
}: DatePickerFieldProps) => {
  const { input } = useField<string>(fieldName);
  const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
    onDateChange: (date: Date | undefined) => {
      input.onChange(date ? dayjs(date).format("YYYY-MM-DD") : undefined);
    },
    openOnFocus: false,
    fromDate,
    toDate,
  });

  return (
    <UNSAFE_DatePicker {...datepickerProps} strategy={strategy}>
      <UNSAFE_DatePicker.Input
        size={size}
        id={fieldName}
        label={label}
        {...inputProps}
      />
    </UNSAFE_DatePicker>
  );
};
