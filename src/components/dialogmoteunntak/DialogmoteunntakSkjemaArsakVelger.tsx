import React, { ReactElement } from "react";
import { Field, useFormState } from "react-final-form";
import { Radio, RadioGruppe } from "nav-frontend-skjema";
import { UnntakArsak } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import DialogmoteunntakSkjemaStatistikk from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaStatistikk";
import { DialogmoteunntakSkjemaValues } from "@/components/dialogmoteunntak/DialogmoteunntakSkjema";

const texts = {
  arsakLegend: "Årsak til unntak (obligatorisk)",
};

export interface UnntakArsakText {
  arsak: UnntakArsak;
  text: string;
}

export const unntakArsakTexts: UnntakArsakText[] = [
  {
    arsak: UnntakArsak.MEDISINSKE_GRUNNER,
    text: "Medisinske grunner",
  },
  {
    arsak: UnntakArsak.INNLEGGELSE_INSTITUSJON,
    text: "Innleggelse i helseinstitusjon",
  },
  {
    arsak: UnntakArsak.FRISKMELDT,
    text: "Friskmeldt",
  },
  {
    arsak: UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER,
    text: "Forventet friskmelding innen 28 ukers sykmelding",
  },
  {
    arsak: UnntakArsak.DOKUMENTERT_TILTAK_FRISKMELDING,
    text: "Tiltak som sannsynligvis vil føre til en friskmelding",
  },
  {
    arsak: UnntakArsak.ARBEIDSFORHOLD_OPPHORT,
    text: "Arbeidsforholdet er opphørt",
  },
];

export const DialogmoteunntakSkjemaArsakVelgerFieldName = "arsak";

const DialogmoteunntakSkjemaArsakVelger = (): ReactElement => {
  const {
    submitFailed,
    errors,
    values: { arsak },
  } = useFormState<DialogmoteunntakSkjemaValues>();
  const showUnntakStatistikk =
    arsak === UnntakArsak.FORVENTET_FRISKMELDING_INNEN_28UKER;

  return (
    <RadioGruppe
      legend={texts.arsakLegend}
      feil={
        submitFailed &&
        errors &&
        errors[DialogmoteunntakSkjemaArsakVelgerFieldName]
      }
    >
      {unntakArsakTexts.map((unntakArsakText, index) => (
        <Field<UnntakArsak>
          key={index}
          name={DialogmoteunntakSkjemaArsakVelgerFieldName}
          value={unntakArsakText.arsak}
          type="radio"
        >
          {({ input, meta }) => (
            <Radio
              {...input}
              label={unntakArsakText.text}
              feil={meta.submitFailed && meta.error}
            />
          )}
        </Field>
      ))}
      {showUnntakStatistikk && <DialogmoteunntakSkjemaStatistikk />}
    </RadioGruppe>
  );
};
export default DialogmoteunntakSkjemaArsakVelger;
