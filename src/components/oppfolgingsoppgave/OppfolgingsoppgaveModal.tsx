import React from "react";
import {
  Button,
  DatePicker,
  Heading,
  HelpText,
  Modal,
  Select,
  useDatepicker,
} from "@navikt/ds-react";
import { useOppdaterOppfolgingsoppgave } from "@/data/oppfolgingsoppgave/useOppdaterOppfolgingsoppgave";
import {
  OppfolgingsoppgaveRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
} from "@/data/oppfolgingsoppgave/types";
import { useForm } from "react-hook-form";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import dayjs from "dayjs";

const texts = {
  header: "Oppfølgingsoppgave",
  save: "Lagre",
  close: "Avbryt",
  missingOppfolgingsgrunn: "Vennligst angi oppfølgingsgrunn.",
  oppfolgingsgrunnLabel: "Hvilken oppfølgingsgrunn har du?",
  oppfolgingsgrunnDefaultOption: "Velg oppfølgingsgrunn",
  datepickerLabel: "Frist",
  oppfolgingsoppgaveHelpText:
    "Her kan du opprette en oppfølgingsoppgave hvis du har behov for å følge opp den sykmeldte utenom de hendelsene Modia lager automatisk. Oppfølgingsbehovet må være hjemlet i folketrygdloven kapittel 8 og den sykmeldte kan kreve innsyn i disse oppgavene.",
  oppfolgingsoppgaveTooltip: "Hva er oppfølgingsoppgave?",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  frist: string | null;
}

interface Props {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

export const OppfolgingsoppgaveModal = ({ isOpen, toggleOpen }: Props) => {
  const oppdaterOppfolgingsoppgave = useOppdaterOppfolgingsoppgave();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormValues>();

  const submit = (values: FormValues) => {
    const oppfolgingsoppgaveDto: OppfolgingsoppgaveRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      frist: values.frist,
    };
    oppdaterOppfolgingsoppgave.mutate(oppfolgingsoppgaveDto, {
      onSuccess: () => {
        Amplitude.logEvent({
          type: EventType.OppfolgingsgrunnSendt,
          data: {
            url: window.location.href,
            oppfolgingsgrunn: values.oppfolgingsgrunn,
          },
        });
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

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Modal
        closeOnBackdropClick
        className="px-6 py-4 w-full max-w-[50rem]"
        aria-label={texts.header}
        open={isOpen}
        onClose={() => toggleOpen(false)}
      >
        <Modal.Header>
          <div className={"flex items-center"}>
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
        </Modal.Header>
        <Modal.Body className={"flex flex-col gap-4"}>
          <Select
            label={texts.oppfolgingsgrunnLabel}
            className="w-72"
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
