import React from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import { ArbeidsuforhetAvslagSkjemaValues } from "@/sider/arbeidsuforhet/avslag/AvslagForm";

const texts = {
  label: "Avslaget gjelder fra",
  missingDate: "Vennligst angi dato",
};

export const AvslagDatePicker = () => {
  const { field, fieldState } = useController<
    ArbeidsuforhetAvslagSkjemaValues,
    "fom"
  >({
    name: "fom",
    rules: {
      required: texts.missingDate,
    },
  });
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      field.onChange(date);
    },
  });

  return (
    <DatePicker {...datepickerProps} strategy="fixed">
      <DatePicker.Input
        {...inputProps}
        size="small"
        label={texts.label}
        error={fieldState.error?.message}
      />
    </DatePicker>
  );
};
