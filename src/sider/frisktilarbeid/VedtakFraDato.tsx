import React from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";

const texts = {
  fraDatoMissing: "Vennligst angi dato",
  fraDatoLabel: "Friskmeldingen gjelder fra",
  fraDatoDescription: "Dette er datoen vedtaket starter",
};

export const VedtakFraDato = () => {
  const { field, fieldState } = useController({
    name: "fraDato",
    rules: {
      required: texts.fraDatoMissing,
    },
  });
  const fraDatoDatePicker = useDatepicker({
    onDateChange: (date: Date | undefined) => field.onChange(date),
    fromDate: new Date(),
  });

  return (
    <DatePicker {...fraDatoDatePicker.datepickerProps}>
      <DatePicker.Input
        {...fraDatoDatePicker.inputProps}
        label={texts.fraDatoLabel}
        description={texts.fraDatoDescription}
        error={fieldState.error?.message}
      />
    </DatePicker>
  );
};
