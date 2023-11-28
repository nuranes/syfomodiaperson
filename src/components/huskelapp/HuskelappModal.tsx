import React from "react";
import {
  BodyShort,
  Button,
  Modal,
  Radio,
  RadioGroup,
  Skeleton,
  Tooltip,
} from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { useGetHuskelappQuery } from "@/data/huskelapp/useGetHuskelappQuery";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import { SkeletonShadowbox } from "@/components/SkeletonShadowbox";
import {
  HuskelappRequestDTO,
  Oppfolgingsgrunn,
} from "@/data/huskelapp/huskelappTypes";
import { PaddingSize } from "@/components/Layout";
import { useRemoveHuskelapp } from "@/data/huskelapp/useRemoveHuskelapp";
import { useForm } from "react-hook-form";

const texts = {
  header: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
  remove: "Fjern",
  removeTooltip: "Fjerner huskelappen og oppgaven fra oversikten",
  missingOppfolgingsgrunn: "Vennligst angi oppfolgingsgrunn.",
  oppfolgingsgrunn: {
    label: "Velg oppfølgingsgrunn",
    taKontaktSykmeldt: "Ta kontakt med den sykmeldte",
    taKontaktArbeidsgiver: "Ta kontakt med arbeidsgiver",
    taKontaktBehandler: "Ta kontakt med behandler",
    vurderDialogmoteSenere: "Vurder dialogmøte på et senere tidspunkt",
    folgOppEtterNesteSykmelding: "Følg opp etter neste sykmelding",
    vurderTiltakBehov: "Vurder behov for tiltak",
    annet:
      "Annet (Gi tilbakemelding i Pilotgruppa på Teams hvilken avhukingsvalg du savner)",
  },
};

const oppfolgingsgrunnToText = {
  [Oppfolgingsgrunn.TA_KONTAKT_SYKEMELDT]:
    texts.oppfolgingsgrunn.taKontaktSykmeldt,
  [Oppfolgingsgrunn.TA_KONTAKT_ARBEIDSGIVER]:
    texts.oppfolgingsgrunn.taKontaktArbeidsgiver,
  [Oppfolgingsgrunn.TA_KONTAKT_BEHANDLER]:
    texts.oppfolgingsgrunn.taKontaktBehandler,
  [Oppfolgingsgrunn.VURDER_DIALOGMOTE_SENERE]:
    texts.oppfolgingsgrunn.vurderDialogmoteSenere,
  [Oppfolgingsgrunn.FOLG_OPP_ETTER_NESTE_SYKMELDING]:
    texts.oppfolgingsgrunn.folgOppEtterNesteSykmelding,
  [Oppfolgingsgrunn.VURDER_TILTAK_BEHOV]:
    texts.oppfolgingsgrunn.vurderTiltakBehov,
  [Oppfolgingsgrunn.ANNET]: texts.oppfolgingsgrunn.annet,
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

const HuskelappSkeleton = () => {
  return (
    <SkeletonShadowbox className={"m-4 h-20"}>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="30%" />
    </SkeletonShadowbox>
  );
};

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  const { huskelapp, isLoading, isSuccess } = useGetHuskelappQuery();
  const oppdaterHuskelapp = useOppdaterHuskelapp();
  const removeHuskelapp = useRemoveHuskelapp();
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

  const handleRemoveHuskelapp = (uuid: string) => {
    removeHuskelapp.mutate(uuid, {
      onSuccess: () => toggleOpen(false),
    });
  };
  const hasHuskelapp = !!huskelapp;
  const existingHuskelappText = !!huskelapp?.tekst
    ? huskelapp.tekst
    : !!huskelapp?.oppfolgingsgrunn
    ? oppfolgingsgrunnToText[huskelapp.oppfolgingsgrunn]
    : null;

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
          {isLoading && <HuskelappSkeleton />}
          {isSuccess &&
            (hasHuskelapp ? (
              <BodyShort>{existingHuskelappText}</BodyShort>
            ) : (
              <RadioGroup
                legend={texts.oppfolgingsgrunn.label}
                name="oppfolgingsgrunn"
                size="small"
                error={errors.oppfolgingsgrunn && texts.missingOppfolgingsgrunn}
              >
                {Object.values(Oppfolgingsgrunn).map(
                  (oppfolgingsgrunn, index) => (
                    <Radio
                      key={index}
                      {...register("oppfolgingsgrunn", { required: true })}
                      value={oppfolgingsgrunn}
                    >
                      {oppfolgingsgrunnToText[oppfolgingsgrunn]}
                    </Radio>
                  )
                )}
              </RadioGroup>
            ))}
        </ModalContent>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => toggleOpen(false)}
          >
            {texts.close}
          </Button>
          {hasHuskelapp ? (
            <Tooltip content={texts.removeTooltip}>
              <Button
                type="button"
                icon={<TrashIcon aria-hidden />}
                variant="danger"
                onClick={() => handleRemoveHuskelapp(huskelapp.uuid)}
                loading={removeHuskelapp.isPending}
                className={"ml-auto"}
              >
                {texts.remove}
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="submit"
              variant="primary"
              loading={oppdaterHuskelapp.isPending}
              disabled={isLoading}
            >
              {texts.save}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </form>
  );
};
