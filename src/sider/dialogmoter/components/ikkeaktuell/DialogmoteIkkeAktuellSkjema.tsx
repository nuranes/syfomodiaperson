import React from "react";
import { Link, Navigate } from "react-router-dom";
import { moteoversiktRoutePath } from "@/routers/AppRouter";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import {
  CreateIkkeAktuellDTO,
  IkkeAktuellArsak,
} from "@/data/dialogmotekandidat/types/dialogmoteikkeaktuellTypes";
import { useValgtPersonident } from "@/hooks/useValgtBruker";
import { useSettDialogmoteIkkeAktuell } from "@/data/dialogmotekandidat/useSettDialogmoteIkkeAktuell";
import { SkjemaInnsendingFeil } from "@/components/SkjemaInnsendingFeil";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  Radio,
  RadioGroup,
  Textarea,
} from "@navikt/ds-react";

export const texts = {
  noBrev: "Det blir ikke sendt ut varsel eller brev til den sykmeldte.",
  infoKandidatlist: `Når du setter ikke aktuell vil arbeidstakeren bli fjernet fra kandidatlisten. Dersom du på et senere tidspunkt vurderer at det likevel er nødvendig med et dialogmøte, kan du kalle inn til dialogmøte ved å søke deg frem til denne arbeidstakeren.`,
  arsakLegend: "Årsak til ikke aktuell (obligatorisk)",
  arsakErrorMessage: "Vennligst angi årsak.",
  beskrivelseLabel: "Beskrivelse (valgfri)",
  send: "Sett ikke aktuell",
  avbryt: "Avbryt",
};

export interface IkkeAktuellArsakText {
  arsak: IkkeAktuellArsak;
  text: string;
}
export const ikkeaktuellArsakTexts: IkkeAktuellArsakText[] = [
  {
    arsak: IkkeAktuellArsak.ARBEIDSTAKER_AAP,
    text: "Innbygger mottar AAP",
  },
  {
    arsak: IkkeAktuellArsak.ARBEIDSTAKER_DOD,
    text: "Innbygger er død",
  },
  {
    arsak: IkkeAktuellArsak.DIALOGMOTE_AVHOLDT,
    text: "Dialogmøte avholdt",
  },
];

export const skjemaBeskrivelseMaxLength = 2000;

interface SkjemaValues {
  arsak: IkkeAktuellArsak;
  beskrivelse?: string;
}

const DialogmoteIkkeAktuellSkjema = () => {
  const personIdent = useValgtPersonident();
  const { isKandidat } = useDialogmotekandidat();
  const settDialogmoteikkeaktuell = useSettDialogmoteIkkeAktuell();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SkjemaValues>();

  if (!isKandidat || settDialogmoteikkeaktuell.isSuccess) {
    return <Navigate to={moteoversiktRoutePath} />;
  }

  const onSubmit: SubmitHandler<SkjemaValues> = (values) => {
    const newIkkeAktuell: CreateIkkeAktuellDTO = {
      personIdent: personIdent,
      arsak: values.arsak,
      beskrivelse: values.beskrivelse,
    };
    settDialogmoteikkeaktuell.mutate(newIkkeAktuell);
  };

  return (
    <Box background="surface-default" padding="6">
      <Alert variant="info" size="small" className="p-4 mb-4">
        {texts.noBrev}
      </Alert>
      <p>{texts.infoKandidatlist}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {settDialogmoteikkeaktuell.isError && (
          <SkjemaInnsendingFeil error={settDialogmoteikkeaktuell.error} />
        )}
        <RadioGroup
          className="mb-4"
          legend={texts.arsakLegend}
          name="arsak"
          size="small"
          error={errors.arsak && texts.arsakErrorMessage}
        >
          {ikkeaktuellArsakTexts.map((ikkeaktuellArsakText, index) => (
            <Radio
              key={index}
              value={ikkeaktuellArsakText.arsak}
              {...register("arsak", { required: true })}
            >
              {ikkeaktuellArsakText.text}
            </Radio>
          ))}
        </RadioGroup>

        <Textarea
          className="mb-4"
          size="small"
          label={texts.beskrivelseLabel}
          value={watch("beskrivelse")}
          {...register("beskrivelse", {
            maxLength: skjemaBeskrivelseMaxLength,
          })}
          maxLength={skjemaBeskrivelseMaxLength}
        />

        <Button
          className="mr-4"
          type="submit"
          variant="primary"
          loading={settDialogmoteikkeaktuell.isPending}
        >
          {texts.send}
        </Button>

        <Button as={Link} to={moteoversiktRoutePath} variant="secondary">
          {texts.avbryt}
        </Button>
      </form>
    </Box>
  );
};

export default DialogmoteIkkeAktuellSkjema;
