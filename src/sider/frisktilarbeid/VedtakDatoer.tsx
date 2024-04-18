import React from "react";
import dayjs from "dayjs";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import { useController } from "react-hook-form";
import { FattVedtakSkjemaValues } from "./FattVedtak";

const texts = {
  fraDatoMissing: "Vennligst angi dato",
  fraDatoLabel: "Friskmeldingen gjelder fra",
  fraDatoDescription: "Dette er datoen vedtaket starter",
  tilDatoLabel: "Til dato (automatisk justert 12 uker frem)",
  tilDatoDescription: "Dette er datoen vedtaket slutter",
};

interface VedtakDatoerProps {
  tilDato: Date | undefined;
  onFraDatoChanged: (fom: Date) => void;
}

export const VedtakDatoer = ({
  tilDato,
  onFraDatoChanged,
}: VedtakDatoerProps) => {
  const { field, fieldState } = useController<FattVedtakSkjemaValues>({
    name: "fraDato",
    rules: {
      required: texts.fraDatoMissing,
    },
  });
  const fraDatoDatePicker = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      if (date) {
        field.onChange(dayjs(date).format("YYYY-MM-DD"));
        onFraDatoChanged(date);
      }
    },
    fromDate: new Date(),
  });
  const tilDatoDatePicker = useDatepicker();

  return (
    <>
      <DatePicker {...fraDatoDatePicker.datepickerProps}>
        <DatePicker.Input
          {...fraDatoDatePicker.inputProps}
          label={texts.fraDatoLabel}
          description={texts.fraDatoDescription}
          error={fieldState.error?.message}
        />
      </DatePicker>
      <DatePicker {...tilDatoDatePicker.datepickerProps}>
        <DatePicker.Input
          value={tilDato ? dayjs(tilDato).format("DD.MM.YYYY") : ""}
          label={texts.tilDatoLabel}
          description={texts.tilDatoDescription}
          readOnly
        />
      </DatePicker>
    </>
  );
};
