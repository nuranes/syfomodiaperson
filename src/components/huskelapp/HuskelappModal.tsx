import React from "react";
import {
  Button,
  DatePicker,
  Heading,
  HelpText,
  Modal,
  Radio,
  RadioGroup,
  useDatepicker,
} from "@navikt/ds-react";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import {
  HuskelappRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
} from "@/data/huskelapp/huskelappTypes";
import { useForm } from "react-hook-form";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import dayjs from "dayjs";

const texts = {
  header: "Oppfølgingsoppgave",
  save: "Lagre",
  close: "Avbryt",
  missingOppfolgingsgrunn: "Vennligst angi oppfølgingsgrunn.",
  oppfolgingsgrunnLabel: "Velg oppfølgingsgrunn",
  datepickerLabel: "Frist",
  oppfolgingsoppgaveHelpText:
    "Her kan du opprette en oppfølgingsoppgave hvis du har behov for å følge opp den sykmeldte utenom de hendelsene Modia lager automatisk. Oppfølgingsbehovet må være hjemlet i folketrygdloven kapittel 8 og den sykmeldte kan kreve innsyn i disse oppgavene.",
  oppfolgingsoppgaveTooltip: "Hva er oppfølgingsoppgave?",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  frist: string | null;
}

interface HuskelappModalProps {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  const oppdaterHuskelapp = useOppdaterHuskelapp();
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormValues>();

  const submit = (values: FormValues) => {
    const huskelappDto: HuskelappRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
      frist: values.frist,
    };
    oppdaterHuskelapp.mutate(huskelappDto, {
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
          <RadioGroup
            legend={texts.oppfolgingsgrunnLabel}
            name="oppfolgingsgrunn"
            size="small"
            error={errors.oppfolgingsgrunn && texts.missingOppfolgingsgrunn}
          >
            {Object.values(Oppfolgingsgrunn).map((oppfolgingsgrunn, index) => (
              <Radio
                key={index}
                {...register("oppfolgingsgrunn", { required: true })}
                value={oppfolgingsgrunn}
              >
                {oppfolgingsgrunnToText[oppfolgingsgrunn]}
              </Radio>
            ))}
          </RadioGroup>
          <DatePicker {...datepickerProps} strategy="fixed">
            <DatePicker.Input
              {...inputProps}
              label={texts.datepickerLabel}
              size="small"
            />
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
            loading={oppdaterHuskelapp.isPending}
          >
            {texts.save}
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
};
