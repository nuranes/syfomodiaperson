import React, { ReactElement, useState } from "react";
import { Field } from "react-final-form";
import { ValidationErrors } from "final-form";
import {
  Radio,
  RadioGruppe,
  SkjemaelementFeilmelding,
} from "nav-frontend-skjema";
import { UnntakArsak } from "@/data/dialogmotekandidat/types/dialogmoteunntakTypes";
import { useFeatureToggles } from "@/data/unleash/unleashQueryHooks";
import { ToggleNames } from "@/data/unleash/unleash_types";
import DialogmoteunntakSkjemaStatistikk from "@/components/dialogmoteunntak/DialogmoteunntakSkjemaStatistikk";

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

interface DialogmoteunntakSkjemaArsakVelgerProps {
  submitFailed: boolean;
  errors: ValidationErrors;
}

const DialogmoteunntakSkjemaArsakVelger = ({
  submitFailed,
  errors,
}: DialogmoteunntakSkjemaArsakVelgerProps): ReactElement => {
  const { isFeatureEnabled } = useFeatureToggles();
  const hasAccessToUnntakStatistikk = isFeatureEnabled(
    ToggleNames.unntaksstatistikk
  );
  const [show, setShow] = useState<boolean>(false);

  const update = (a: string) => {
    if (a === "Forventet friskmelding innen 28 ukers sykmelding") {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <RadioGruppe legend={texts.arsakLegend}>
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
              onChange={(e) => {
                input.onChange(e);
                update(unntakArsakText.text);
              }}
              label={unntakArsakText.text}
              feil={meta.submitFailed && meta.error}
            />
          )}
        </Field>
      ))}
      <SkjemaelementFeilmelding>
        {submitFailed &&
          errors &&
          errors[DialogmoteunntakSkjemaArsakVelgerFieldName]}
      </SkjemaelementFeilmelding>
      {show && hasAccessToUnntakStatistikk && (
        <DialogmoteunntakSkjemaStatistikk />
      )}
    </RadioGruppe>
  );
};
export default DialogmoteunntakSkjemaArsakVelger;
