import React, { useState } from "react";
import { Button, Heading, Modal, Skeleton, Textarea } from "@navikt/ds-react";
import styled from "styled-components";
import { useGetHuskelappQuery } from "@/data/huskelapp/useGetHuskelappQuery";
import { useOppdaterHuskelapp } from "@/data/huskelapp/useOppdaterHuskelapp";
import { HuskelappDTO } from "@/data/huskelapp/huskelappTypes";

const texts = {
  header: "Huskelapp",
  textAreaLabel: "Huskelapp",
  save: "Lagre",
  close: "Avbryt",
};

interface HuskelappModalProps {
  isOpen: boolean;
  toggleOpen: (value: boolean) => void;
}

const StyledModal = styled(Modal)`
  padding: 1em 1.5em;
  max-width: 50em;
  width: 100%;
`;

const ModalContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
`;

const RightAlignedButtons = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 1em;
  gap: 1em;
`;

const StyledSkeleton = styled(Skeleton)`
  margin: 1em;
`;

export const HuskelappModal = ({ isOpen, toggleOpen }: HuskelappModalProps) => {
  const { huskelapp, isLoading, isSuccess } = useGetHuskelappQuery();
  const [tekst, setTekst] = useState<string>(huskelapp?.tekst ?? "");
  const oppdaterHuskelappQuery = useOppdaterHuskelapp();

  const oppdaterTekst = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTekst(e.target.value);
  };

  const oppdaterHuskelapp = () => {
    const huskelappDto: HuskelappDTO = { tekst: tekst };
    oppdaterHuskelappQuery.mutate(huskelappDto, {
      onSuccess: () => toggleOpen(false),
    });
  };

  return (
    <StyledModal
      aria-label={"huskelapp"}
      open={isOpen}
      onClose={() => toggleOpen(!isOpen)}
    >
      <Heading size="medium" as="h2">
        {texts.header}
      </Heading>
      {isLoading && <StyledSkeleton height={90} variant="rounded" />}
      {isSuccess && (
        <ModalContent>
          <Textarea
            label={texts.textAreaLabel}
            hideLabel
            defaultValue={huskelapp?.tekst}
            onChange={oppdaterTekst}
          />
        </ModalContent>
      )}
      <RightAlignedButtons>
        <Button variant="secondary" onClick={() => toggleOpen(false)}>
          {texts.close}
        </Button>
        <Button
          variant="primary"
          onClick={oppdaterHuskelapp}
          loading={oppdaterHuskelappQuery.isLoading}
        >
          {texts.save}
        </Button>
      </RightAlignedButtons>
    </StyledModal>
  );
};
