import React from "react";
import dayjs from "dayjs";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import { AvventAktivitetskravSkjemaValues } from "@/sider/aktivitetskrav/vurdering/AvventAktivitetskravSkjema";
import { toDatePrettyPrint } from "@/utils/datoUtils";

const texts = {
  label: "Avventer til",
};

export const AvventFristDato = () => {
  const now = new Date();
  const inTwoMonths = dayjs(now).add(2, "months").toDate();
  const invalidDateMessage = `Vennligst angi en gyldig dato innen ${toDatePrettyPrint(
    inTwoMonths
  )}`;

  const { field, fieldState } = useController<
    AvventAktivitetskravSkjemaValues,
    "fristDato"
  >({
    name: "fristDato",
    rules: {
      required: true,
    },
  });
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : undefined);
    },
    fromDate: now,
    toDate: inTwoMonths,
  });

  return (
    <DatePicker {...datepickerProps} strategy="fixed">
      <DatePicker.Input
        id={field.name}
        {...inputProps}
        size="small"
        label={texts.label}
        error={fieldState.error && invalidDateMessage}
      />
    </DatePicker>
  );
};
