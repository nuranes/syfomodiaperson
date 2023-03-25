import React from "react";
import dayjs from "dayjs";
import { DatePickerField } from "@/components/DatePickerField";

const texts = {
  label: "Avventer til",
};

export const avventerFristDatoField = "fristDato";

export const AvventFristDato = () => {
  const now = new Date();
  const today = dayjs(now);
  const inTwoMonths = today.add(2, "months");

  return (
    <DatePickerField
      fieldName={avventerFristDatoField}
      label={texts.label}
      size="small"
      strategy="fixed"
      fromDate={today.toDate()}
      toDate={inTwoMonths.toDate()}
    />
  );
};
