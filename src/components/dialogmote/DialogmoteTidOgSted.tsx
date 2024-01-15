import React, { ReactElement } from "react";
import { Field } from "react-final-form";
import DialogmoteDatoField from "./DialogmoteDatoField";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { addWeeks, visDato } from "@/utils/datoUtils";
import { useDialogmotekandidat } from "@/data/dialogmotekandidat/dialogmotekandidatQueryHooks";
import { TextField } from "@navikt/ds-react";

const texts = {
  title: "Tid og sted",
  stedLabel: "Sted",
  stedPlaceholder: "F.eks: På arbeidsplassen",
  tidLabel: "Klokkeslett",
  videoLabel: "Lenke til videomøte (valgfritt)",
};

const FRIST_DIALOGMOTE2_IN_WEEKS = 26;

interface FristProps {
  startDate: Date;
}

const Frist = ({ startDate }: FristProps) => {
  const frist = addWeeks(startDate, FRIST_DIALOGMOTE2_IN_WEEKS);
  return <p>Frist dialogmøte 2: {visDato(frist)}</p>;
};

const DialogmoteTidOgSted = (): ReactElement => {
  const klokkeslettField = "klokkeslett";
  const stedField = "sted";
  const videoLinkField = "videoLink";
  const { hasActiveOppfolgingstilfelle, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const { isKandidat } = useDialogmotekandidat();

  return (
    <div className="flex flex-col gap-4 mb-6">
      {isKandidat &&
        hasActiveOppfolgingstilfelle &&
        latestOppfolgingstilfelle && (
          <Frist startDate={latestOppfolgingstilfelle.start} />
        )}
      <div className="flex gap-4">
        <DialogmoteDatoField />
        <Field<string> name={klokkeslettField}>
          {({ input, meta }) => (
            <TextField
              {...input}
              autoComplete="off"
              size="small"
              type="time"
              id={klokkeslettField}
              label={texts.tidLabel}
              error={meta.submitFailed && meta.error}
            />
          )}
        </Field>
      </div>
      <Field<string> name={stedField}>
        {({ input, meta }) => (
          <TextField
            {...input}
            size="small"
            type="text"
            id={stedField}
            description={texts.stedPlaceholder}
            label={texts.stedLabel}
            error={meta.submitFailed && meta.error}
          />
        )}
      </Field>
      <Field<string> name={videoLinkField}>
        {({ input, meta }) => (
          <TextField
            {...input}
            size="small"
            type="text"
            id={videoLinkField}
            label={texts.videoLabel}
            error={meta.submitFailed && meta.error}
          />
        )}
      </Field>
    </div>
  );
};

export default DialogmoteTidOgSted;
