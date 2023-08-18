import { FlexRow, JustifyContentType, PaddingSize } from "./Layout";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { Button, Heading, Modal } from "@navikt/ds-react";

const texts = {
  close: "Lukk",
};

const ForhandsvisningModal = styled(Modal)`
  max-width: 50em;
`;

const ModalContent = styled(Modal.Content)`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 2em;
`;

interface ForhandsvisningProps {
  title?: string;
  contentLabel: string;
  isOpen: boolean;
  handleClose: () => void;
  getDocumentComponents: () => DocumentComponentDto[];
}

export const Forhandsvisning = ({
  isOpen,
  handleClose,
  title,
  contentLabel,
  getDocumentComponents,
}: ForhandsvisningProps): ReactElement => {
  const documentComponents = isOpen ? getDocumentComponents() : [];
  return (
    <ForhandsvisningModal
      open={isOpen}
      aria-label={contentLabel}
      onClose={handleClose}
    >
      <ModalContent>
        {title ? (
          <FlexRow justifyContent={JustifyContentType.CENTER}>
            <Heading size="xlarge">{title}</Heading>
          </FlexRow>
        ) : null}
        {documentComponents.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
        <FlexRow topPadding={PaddingSize.MD}>
          <Button onClick={handleClose}>{texts.close}</Button>
        </FlexRow>
      </ModalContent>
    </ForhandsvisningModal>
  );
};
