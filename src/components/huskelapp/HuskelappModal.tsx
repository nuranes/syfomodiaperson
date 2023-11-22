import React, { useState } from "react";
import { Button, Modal, Skeleton, Textarea, Tooltip } from "@navikt/ds-react";
import { TrashIcon } from "@navikt/aksel-icons";
import styled from "styled-components";
import { useGetHuskelappQuery } from "@/data/huskelapp/useGetHuskelappQuery";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import { SkeletonShadowbox } from "@/components/SkeletonShadowbox";
import { HuskelappRequestDTO } from "@/data/huskelapp/huskelappTypes";
import { PaddingSize } from "@/components/Layout";
import { useRemoveHuskelapp } from "@/data/huskelapp/useRemoveHuskelapp";

const texts = {
  header: "Huskelapp",
  textAreaLabel: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
  remove: "Fjern",
  removeTooltip: "Fjerner huskelappen og oppgaven fra oversikten",
};

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

const StyledSkeletonWrapper = styled(SkeletonShadowbox)`
  margin: 1em;
  height: 5em;
`;

const HuskelappSkeleton = () => {
  return (
    <StyledSkeletonWrapper>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="30%" />
    </StyledSkeletonWrapper>
  );
};

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  const { huskelapp, isLoading, isSuccess } = useGetHuskelappQuery();
  const [tekst, setTekst] = useState<string>(huskelapp?.tekst ?? "");
  const oppdaterHuskelapp = useOppdaterHuskelapp();
  const removeHuskelapp = useRemoveHuskelapp();

  const oppdaterTekst = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTekst(e.target.value);
  };

  const handleOppdaterHuskelapp = () => {
    const huskelappDto: HuskelappRequestDTO = { tekst: tekst };
    oppdaterHuskelapp.mutate(huskelappDto, {
      onSuccess: () => toggleOpen(false),
    });
  };

  const handleRemoveHuskelapp = (uuid: string) => {
    removeHuskelapp.mutate(uuid, {
      onSuccess: () => toggleOpen(false),
    });
  };

  return (
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
        {isSuccess && (
          <Textarea
            label={texts.textAreaLabel}
            hideLabel
            defaultValue={huskelapp?.tekst}
            onChange={oppdaterTekst}
          />
        )}
      </ModalContent>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleOppdaterHuskelapp}
          loading={oppdaterHuskelapp.isLoading}
          disabled={isLoading}
        >
          {texts.save}
        </Button>
        <Button variant="secondary" onClick={() => toggleOpen(false)}>
          {texts.close}
        </Button>
        {huskelapp && (
          <Tooltip content={texts.removeTooltip}>
            <Button
              icon={<TrashIcon aria-hidden />}
              variant="danger"
              onClick={() => handleRemoveHuskelapp(huskelapp.uuid)}
              loading={removeHuskelapp.isLoading}
            >
              {texts.remove}
            </Button>
          </Tooltip>
        )}
      </Modal.Footer>
    </Modal>
  );
};
