import React from "react";
import { Button, Modal, Radio, RadioGroup } from "@navikt/ds-react";
import styled from "styled-components";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import {
  HuskelappRequestDTO,
  Oppfolgingsgrunn,
  oppfolgingsgrunnToText,
} from "@/data/huskelapp/huskelappTypes";
import { PaddingSize } from "@/components/Layout";
import { useForm } from "react-hook-form";

const texts = {
  header: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
  missingOppfolgingsgrunn: "Vennligst angi oppfolgingsgrunn.",
  oppfolgingsgrunnLabel: "Velg oppfølgingsgrunn",
};

interface FormValues {
  oppfolgingsgrunn: Oppfolgingsgrunn;
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
  } = useForm<FormValues>();

  const submit = (values: FormValues) => {
    const huskelappDto: HuskelappRequestDTO = {
      oppfolgingsgrunn: values.oppfolgingsgrunn,
    };
    oppdaterHuskelapp.mutate(huskelappDto, {
      onSuccess: () => toggleOpen(false),
    });
  };

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
