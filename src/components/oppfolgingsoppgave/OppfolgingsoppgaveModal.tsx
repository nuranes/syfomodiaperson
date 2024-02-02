import React from "react";
import {
  Alert,
  BodyLong,
  Button,
  DatePicker,
  Heading,
  HelpText,
  Modal,
  Select,
  Textarea,
  useDatepicker,
} from "@navikt/ds-react";
import { useOppdaterOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useOppdaterOppfolgingsoppgave";
import {
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
  OppfolgingsoppgaveRequestDTO,
} from "@/data/oppfolgingsoppgave/types";
import { useForm } from "react-hook-form";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import dayjs from "dayjs";

const texts = {
  header: "Oppfølgingsoppgave",
  guidelines:
    "Denne oppgaven skal kun brukes etter formålet, altså ikke til andre oppgaver enn det oppfølgingsgrunnen tilsier. Innbyggeren kan få innsyn i det du skriver her.",
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
}

const MAX_LENGTH_BESKRIVELSE = 100;

function logOppfolgingsgrunnSendt(oppfolgingsgrunn: Oppfolgingsgrunn) {
  Amplitude.logEvent({
    type: EventType.OppfolgingsgrunnSendt,
    data: {
      url: window.location.href,
      oppfolgingsgrunn: oppfolgingsgrunn,
    },
  });
}

export const OppfolgingsoppgaveModal = ({ isOpen, toggleOpen }: Props) => {
  const oppdaterOppfolgingsoppgave = useOppdaterOppfolgingsoppgave();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormValues>();

  const submit = (values: FormValues) => {
    const oppfolgingsoppgaveDto: OppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      tekst:
        values.oppfolgingsgrunn == Oppfolgingsgrunn.ANNET
          ? undefined
          : values.beskrivelse,
      frist: values.frist,
    };
    oppdaterOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => {
        logOppfolgingsgrunnSendt(values.oppfolgingsgrunn);
        toggleOpen(false);
      },
    });
  };

  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (date: Date | undefined) => {
      setValue("frist", dayjs(date).format("YYYY-MM-DD") ?? null);
    },
    fromDate: new Date(),
  });

  const isBeskrivelseInputVisible =
    watch("oppfolgingsgrunn") !== Oppfolgingsgrunn.ANNET;

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
            className="w-[22rem]"
            {...register("oppfolgingsgrunn", { required: true })}
            error={errors.oppfolgingsgrunn && texts.missingOppfolgingsgrunn}
          >
            <option value="">{texts.oppfolgingsgrunnDefaultOption}</option>
            {Object.values(Oppfolgingsgrunn).map((oppfolgingsgrunn, index) => (
              <option key={index} value={oppfolgingsgrunn}>
                {oppfolgingsgrunnToText[oppfolgingsgrunn]}
              </option>
            ))}
          </Select>
          {isBeskrivelseInputVisible && (
            <Textarea
              label={texts.beskrivelseLabel}
              size="small"
              value={watch("beskrivelse")}
              maxLength={MAX_LENGTH_BESKRIVELSE}
              {...register("beskrivelse", {
                maxLength: MAX_LENGTH_BESKRIVELSE,
              })}
            ></Textarea>
          )}
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
            loading={oppdaterOppfolgingsoppgave.isPending}
          >
            {texts.save}
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
};
