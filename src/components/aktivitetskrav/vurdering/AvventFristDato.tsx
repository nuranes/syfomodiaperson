import React from "react";
import dayjs from "dayjs";
import { DatePickerField } from "@/components/DatePickerField";
import { validerDato } from "@/utils/valideringUtils";

const texts = {
  label: "Avventer til",
};

export const avventerFristDatoField = "fristDato";

export const AvventFristDato = () => {
  const now = new Date();
  const inTwoMonths = dayjs(now).add(2, "months").toDate();

  return (
    <DatePickerField
      fieldName={avventerFristDatoField}
      validate={(value) => validerDato(value, now, inTwoMonths)}
      label={texts.label}
      size="small"
      strategy="fixed"
      fromDate={now}
      toDate={inTwoMonths}
    />
  );
};
