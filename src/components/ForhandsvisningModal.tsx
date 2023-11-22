import { FlexRow, JustifyContentType } from "./Layout";
import React, { ReactElement } from "react";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";
import { Button, Heading, Modal } from "@navikt/ds-react";

const texts = {
  close: "Lukk",
};

interface ForhandsvisningProps {
  title?: string;
  contentLabel: string;
  isOpen: boolean;
  handleClose: () => void;
  getDocumentComponents: () => DocumentComponentDto[];
}

export const ForhandsvisningModal = ({
  isOpen,
  handleClose,
  title,
  contentLabel,
  getDocumentComponents,
}: ForhandsvisningProps): ReactElement => {
  const documentComponents = isOpen ? getDocumentComponents() : [];
  return (
    <Modal
      closeOnBackdropClick
      className="max-w-[50rem]"
      open={isOpen}
      aria-label={contentLabel}
      onClose={handleClose}
    >
      <Modal.Header>
        {title ? (
          <FlexRow justifyContent={JustifyContentType.CENTER}>
            <Heading size="xlarge">{title}</Heading>
          </FlexRow>
        ) : null}
      </Modal.Header>
      <Modal.Body className={"flex flex-col flex-1 p-8"}>
        {documentComponents.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleClose}>
          {texts.close}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
