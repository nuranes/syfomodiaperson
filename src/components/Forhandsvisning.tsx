import ModalWrapper from "nav-frontend-modal";
import {
  FlexRow,
  JustifyContentType,
  ModalContentContainer,
  PaddingSize,
} from "./Layout";
import {
  Element,
  Innholdstittel,
  Normaltekst,
  Sidetittel,
  Systemtittel,
} from "nav-frontend-typografi";
import React, { ReactElement } from "react";
import styled from "styled-components";
import Lenke from "nav-frontend-lenker";
import { Hovedknapp } from "nav-frontend-knapper";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";

const texts = {
  close: "Lukk",
};

const Paragraph = styled.div`
  margin-bottom: 1em;
  white-space: pre-wrap;
`;

const TitledParagraph = styled.div`
  margin: 1em 0;
  white-space: pre-wrap;
`;

const ForhandsvisningModal = styled(ModalWrapper)`
  max-width: 50em;
`;

const DocumentComponentLink = (texts: string[], title?: string) => {
  const link = texts.length === 0 ? "" : texts[0];
  return (
    <TitledParagraph>
      <Element>{title ?? ""}</Element>
      <Lenke target="_blank" rel="noopener noreferrer" href={link}>
        {link}
      </Lenke>
    </TitledParagraph>
  );
};

const DocumentComponentHeaderH1 = (texts: string[]) => {
  const header = texts.length === 0 ? "" : texts[0];
  return (
    <FlexRow topPadding={PaddingSize.MD} bottomPadding={PaddingSize.MD}>
      <Innholdstittel>{header}</Innholdstittel>
    </FlexRow>
  );
};

const DocumentComponentHeaderH2 = (texts: string[]) => {
  const header = texts.length === 0 ? "" : texts[0];
  return (
    <FlexRow topPadding={PaddingSize.SM}>
      <Systemtittel>{header}</Systemtittel>
    </FlexRow>
  );
};

const DocumentComponentParagraph = (texts: string[], title?: string) => {
  const paragraphText = (
    <>
      {texts.map((text, index) => (
        <Normaltekst key={index}>
          {text}
          <br />
        </Normaltekst>
      ))}
    </>
  );

  return title ? (
    <TitledParagraph>
      <Element>{title}</Element>
      {paragraphText}
    </TitledParagraph>
  ) : (
    <Paragraph>{paragraphText}</Paragraph>
  );
};

interface DocumentComponentVisningProps {
  documentComponent: DocumentComponentDto;
}

const DocumentComponentVisning = ({
  documentComponent: { type, title, texts },
}: DocumentComponentVisningProps) => {
  switch (type) {
    case DocumentComponentType.HEADER: {
      return DocumentComponentHeaderH2(texts);
    }
    case DocumentComponentType.HEADER_H1: {
      return DocumentComponentHeaderH1(texts);
    }
    case DocumentComponentType.HEADER_H2: {
      return DocumentComponentHeaderH2(texts);
    }
    case DocumentComponentType.LINK: {
      return DocumentComponentLink(texts, title);
    }
    case DocumentComponentType.PARAGRAPH: {
      return DocumentComponentParagraph(texts, title);
    }
    default: {
      return null;
    }
  }
};

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
        <FlexRow topPadding={PaddingSize.SM}>
          {title ? (
            <FlexRow justifyContent={JustifyContentType.CENTER}>
              <Sidetittel>{title}</Sidetittel>
            </FlexRow>
          ) : null}
        </FlexRow>
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
