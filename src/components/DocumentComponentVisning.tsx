import React, { ReactElement } from "react";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import {
  Element,
  Innholdstittel,
  Normaltekst,
  Systemtittel,
} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import { FlexRow, PaddingSize } from "@/components/Layout";
import styled from "styled-components";

const Paragraph = styled.div`
  margin-bottom: 1em;
  white-space: pre-wrap;
`;

const TitledParagraph = styled.div`
  margin: 1em 0;
  white-space: pre-wrap;
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

export const DocumentComponentVisning = ({
  documentComponent: { type, title, texts },
}: DocumentComponentVisningProps): ReactElement => {
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
  }
};
