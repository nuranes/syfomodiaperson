import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  BodyLong,
  Button,
  DatePicker,
  ErrorMessage,
  Heading,
  HelpText,
  Modal,
  Select,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { useCreateOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useCreateOppfolgingsoppgave";
import {
  EditOppfolgingsoppgaveRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
  OppfolgingsoppgaveRequestDTO,
  OppfolgingsoppgaveResponseDTO,
} from "@/data/oppfolgingsoppgave/types";
import { useForm } from "react-hook-form";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import dayjs from "dayjs";
import { useEditOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useEditOppfolgingsoppgave";

const texts = {
  header: "Oppfølgingsoppgave",
  guidelines:
    "Denne oppgaven skal kun brukes etter formålet, altså ikke til andre oppgaver enn det oppfølgingsgrunnen tilsier. Innbyggeren kan få innsyn i det du skriver her.",
  annetChosenAlert:
    "Denne oppgaven skal kun brukes til sykefraværsoppfølging, altså ikke oppgaver knyttet til andre ytelser eller formål. Innbyggeren kan få innsyn i det du skriver her.",
  formNeedsChangeToSave: "Du må gjøre en endring før du kan lagre.",
  save: "Lagre",
  close: "Avbryt",
  missingOppfolgingsgrunn: "Vennligst angi oppfølgingsgrunn.",
  oppfolgingsgrunnLabel: "Hvilken oppfølgingsgrunn har du? (obligatorisk)",
  oppfolgingsgrunnDefaultOption: "Velg oppfølgingsgrunn",
  beskrivelseLabel: "Beskrivelse",
  datepickerLabel: "Frist",
  oppfolgingsoppgaveHelpText:
    "Her kan du opprette en oppfølgingsoppgave hvis du har behov for å følge opp den sykmeldte utenom de hendelsene Modia lager automatisk. Oppfølgingsbehovet må være hjemlet i folketrygdloven kapittel 8 og den sykmeldte kan kreve innsyn i disse oppgavene.",
  oppfolgingsoppgaveTooltip: "Hva er oppfølgingsoppgave?",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  beskrivelse?: string;
  frist: string | null;
}

interface Props {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
  existingOppfolgingsoppgave?: OppfolgingsoppgaveResponseDTO;
}

const MAX_LENGTH_BESKRIVELSE = 200;

function logOppfolgingsgrunnSendt(oppfolgingsgrunn: Oppfolgingsgrunn) {
  Amplitude.logEvent({
    type: EventType.OppfolgingsgrunnSendt,
    data: {
      url: window.location.href,
      oppfolgingsgrunn: oppfolgingsgrunn,
    },
  });
}

function logOppfolgingsoppgaveEdited(
  oppfolgingsgrunn: Oppfolgingsgrunn,
  existingOppfolgingsoppgave: OppfolgingsoppgaveResponseDTO,
  editedOppfolgingsoppgave: EditOppfolgingsoppgaveRequestDTO
) {
  const editedFields: string[] = [];
  if (editedOppfolgingsoppgave.frist !== existingOppfolgingsoppgave.frist) {
    editedFields.push("frist");
  }
  if (editedOppfolgingsoppgave.tekst !== existingOppfolgingsoppgave.tekst) {
    editedFields.push("tekst");
  }
  Amplitude.logEvent({
    type: EventType.OppfolgingsoppgaveEdited,
    data: {
      url: window.location.href,
      oppfolgingsgrunn: oppfolgingsgrunn,
      fieldsEdited: editedFields,
    },
  });
}

export const OppfolgingsoppgaveModal = ({
  isOpen,
  toggleOpen,
  existingOppfolgingsoppgave,
}: Props) => {
  const [isFormError, setIsFormError] = useState(false);
  const [isFristTouched, setIsFristTouched] = useState(false);
  const createOppfolgingsoppgave = useCreateOppfolgingsoppgave();
  const editOppfolgingsoppgave = useEditOppfolgingsoppgave(
    existingOppfolgingsoppgave?.uuid
  );
  const {
    register,
    formState: { errors, isDirty },
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      beskrivelse: existingOppfolgingsoppgave?.tekst ?? "",
      frist: existingOppfolgingsoppgave?.frist ?? null,
    },
  });
  const watchedValues = watch();
  const isEditMode = !!existingOppfolgingsoppgave;

  const isFormEdited = useCallback(
    (existingOppfolgingsoppgave) => {
      const isFristEdited =
        watchedValues.frist !== existingOppfolgingsoppgave?.frist;
      const isBeskrivelseEdited =
        watchedValues.beskrivelse !== existingOppfolgingsoppgave?.tekst;
      return isFristEdited || isBeskrivelseEdited;
    },
    [watchedValues]
  );

  useEffect(() => {
    if (isDirty || isFristTouched) {
      setIsFormError(!isFormEdited(existingOppfolgingsoppgave));
    }
  }, [
    existingOppfolgingsoppgave,
    isDirty,
    isFormEdited,
    isFristTouched,
    watchedValues,
  ]);

  const submit = (values: FormValues) => {
    if (isEditMode) {
      if (!isFormEdited(existingOppfolgingsoppgave)) {
        setIsFormError(true);
      } else {
        submitEditedOppfolgingsoppgave(values, existingOppfolgingsoppgave);
      }
    } else {
      submitNewOppfolgingsoppgave(values);
    }
  };

  function submitEditedOppfolgingsoppgave(
    values: FormValues,
    existingOppfolgingsoppgave: OppfolgingsoppgaveResponseDTO
  ) {
    const oppfolgingsoppgaveDto: EditOppfolgingsoppgaveRequestDTO = {
      tekst: values.beskrivelse,
      frist: values.frist,
    };
    editOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => {
        logOppfolgingsoppgaveEdited(
          values.oppfolgingsgrunn,
          existingOppfolgingsoppgave,
          oppfolgingsoppgaveDto
        );
        toggleOpen(false);
      },
    });
  }

  function submitNewOppfolgingsoppgave(values: FormValues) {
    const oppfolgingsoppgaveDto: OppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      tekst: values.beskrivelse,
      frist: values.frist,
    };
    createOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => {
        logOppfolgingsgrunnSendt(values.oppfolgingsgrunn);
        toggleOpen(false);
      },
    });
  }

  const defaultSelectedDate = !!existingOppfolgingsoppgave?.frist
    ? dayjs(existingOppfolgingsoppgave.frist).toDate()
    : undefined;
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      date
        ? setValue("frist", dayjs(date).format("YYYY-MM-DD"))
        : setValue("frist", null);
      setIsFristTouched(true);
    },
    defaultSelected: defaultSelectedDate,
    fromDate: new Date(),
  });

  const isOppfolgingsgrunnAnnet =
    watch("oppfolgingsgrunn") === Oppfolgingsgrunn.ANNET;

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Modal
        closeOnBackdropClick
        className="px-6 py-4 w-full max-w-[50rem]"
        aria-label={texts.header}
        open={isOpen}
        onClose={() => toggleOpen(false)}
      >
        <Modal.Header className="mb-4">
          <div className={"flex items-center mb-4"}>
            <Heading
              level="1"
              size="medium"
              id="modal-heading"
              className={"mr-2"}
            >
              {texts.header}
            </Heading>
            <HelpText
              title={texts.oppfolgingsoppgaveTooltip}
              placement="right"
              className={"self-center"}
            >
              {texts.oppfolgingsoppgaveHelpText}
            </HelpText>
          </div>
          <Alert inline variant="warning">
            <BodyLong textColor="subtle" size="small">
              {texts.guidelines}
            </BodyLong>
          </Alert>
        </Modal.Header>

        <Modal.Body className={"flex flex-col gap-4"}>
          <Select
            label={texts.oppfolgingsgrunnLabel}
            size="small"
            className="w-[24rem]"
            {...register("oppfolgingsgrunn", { required: true })}
            error={errors.oppfolgingsgrunn && texts.missingOppfolgingsgrunn}
            readOnly={isEditMode}
            value={existingOppfolgingsoppgave?.oppfolgingsgrunn}
          >
            <option value="">{texts.oppfolgingsgrunnDefaultOption}</option>
            {Object.values(Oppfolgingsgrunn).map((oppfolgingsgrunn, index) => (
              <option key={index} value={oppfolgingsgrunn}>
                {oppfolgingsgrunnToText[oppfolgingsgrunn]}
              </option>
            ))}
          </Select>

          {isOppfolgingsgrunnAnnet && (
            <Alert inline variant="warning">
              <BodyLong textColor="subtle" size="small">
                {texts.annetChosenAlert}
              </BodyLong>
            </Alert>
          )}

          <Textarea
            label={texts.beskrivelseLabel}
            size="small"
            value={watch("beskrivelse")}
            maxLength={MAX_LENGTH_BESKRIVELSE}
            {...register("beskrivelse", {
              maxLength: MAX_LENGTH_BESKRIVELSE,
            })}
          ></Textarea>

          <DatePicker {...datepickerProps} strategy="fixed">
            <DatePicker.Input {...inputProps} label={texts.datepickerLabel} />
          </DatePicker>
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => toggleOpen(false)}
          >
            {texts.close}
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={
              createOppfolgingsoppgave.isPending ||
              editOppfolgingsoppgave.isPending
            }
          >
            {texts.save}
          </Button>
          {isFormError && (
            <ErrorMessage>{texts.formNeedsChangeToSave}</ErrorMessage>
          )}
        </Modal.Footer>
      </Modal>
    </form>
  );
};
