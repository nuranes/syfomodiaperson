import React from "react";
import {
  Button,
  DatePicker,
  Modal,
  Radio,
  RadioGroup,
  useDatepicker,
} from "@navikt/ds-react";
import styled from "styled-components";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import {
  HuskelappRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
} from "@/data/huskelapp/huskelappTypes";
import { PaddingSize } from "@/components/Layout";
import { useForm } from "react-hook-form";
import * as Amplitude from "@/utils/amplitude";
import { EventType } from "@/utils/amplitude";
import dayjs from "dayjs";

const texts = {
  header: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
  missingOppfolgingsgrunn: "Vennligst angi oppfolgingsgrunn.",
  oppfolgingsgrunnLabel: "Velg oppfølgingsgrunn",
  datepickerLabel: "Frist",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
  frist: string | null;
}

interface HuskelappModalProps {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

const ModalContent = styled(Modal.Body)`
  display: flex;
  flex-direction: column;

  > * {
    &:not(:last-child) {
      padding-bottom: ${PaddingSize.SM};
    }
  }
`;

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
        aria-label={"huskelapp"}
        open={isOpen}
        onClose={() => toggleOpen(false)}
        header={{ heading: texts.header }}
      >
        <ModalContent>
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
        </ModalContent>
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
