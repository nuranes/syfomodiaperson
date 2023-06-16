import ModalWrapper from "nav-frontend-modal";
import {
  FlexRow,
  JustifyContentType,
  ModalContentContainer,
  PaddingSize,
} from "./Layout";
import { Sidetittel } from "nav-frontend-typografi";
import React, { ReactElement } from "react";
import styled from "styled-components";
import { Hovedknapp } from "nav-frontend-knapper";
import { DocumentComponentDto } from "@/data/documentcomponent/documentComponentTypes";
import { DocumentComponentVisning } from "@/components/DocumentComponentVisning";

const texts = {
  close: "Lukk",
};

const ForhandsvisningModal = styled(ModalWrapper)`
  max-width: 50em;
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
      isOpen={isOpen}
      onRequestClose={handleClose}
      closeButton={true}
      contentLabel={contentLabel}
      ariaHideApp={false}
    >
      <ModalContentContainer data-cy="ForhåndsvisningModal">
        {title ? (
          <FlexRow justifyContent={JustifyContentType.CENTER}>
            <Sidetittel>{title}</Sidetittel>
          </FlexRow>
        ) : null}
        {documentComponents.map((component, index) => (
          <DocumentComponentVisning key={index} documentComponent={component} />
        ))}
        <FlexRow topPadding={PaddingSize.MD}>
          <Hovedknapp onClick={handleClose}>{texts.close}</Hovedknapp>
        </FlexRow>
      </ModalContentContainer>
    </ForhandsvisningModal>
  );
};
