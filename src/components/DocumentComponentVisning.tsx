import React, { ReactElement } from "react";
import {
  DocumentComponentDto,
  DocumentComponentType,
} from "@/data/documentcomponent/documentComponentTypes";
import { FlexRow, PaddingSize } from "@/components/Layout";
import styled from "styled-components";
import { BodyLong, Heading, Label, Link } from "@navikt/ds-react";

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
      <Label size="small">{title ?? ""}</Label>
      <br />
      <Link target="_blank" rel="noopener noreferrer" href={link}>
        {link}
      </Link>
    </TitledParagraph>
  );
};

const DocumentComponentHeaderH1 = (texts: string[]) => {
  const header = texts.length === 0 ? "" : texts[0];
  return (
    <FlexRow topPadding={PaddingSize.MD} bottomPadding={PaddingSize.MD}>
      <Heading size="large">{header}</Heading>
    </FlexRow>
  );
};

const DocumentComponentHeaderH2 = (texts: string[]) => {
  const header = texts.length === 0 ? "" : texts[0];
  return (
    <FlexRow topPadding={PaddingSize.SM}>
      <Heading size="medium">{header}</Heading>
    </FlexRow>
  );
};

const DocumentComponentParagraph = (texts: string[], title?: string) => {
  const paragraphText = (
    <>
      {texts.map((text, index) => (
        <BodyLong size="small" key={index}>
          {text}
          <br />
        </BodyLong>
      ))}
    </>
  );

  return title ? (
    <TitledParagraph>
      <Label size="small">{title}</Label>
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
