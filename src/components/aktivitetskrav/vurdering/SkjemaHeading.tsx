import { FlexColumn, FlexRow, PaddingSize } from "@/components/Layout";
import { BodyShort, Heading } from "@navikt/ds-react";
import React from "react";

interface VurderAktivitetskravSkjemaHeadingProps {
  title: string;
  subtitles?: string[];
}

export const SkjemaHeading = ({
  title,
  subtitles,
}: VurderAktivitetskravSkjemaHeadingProps) => (
  <>
    <FlexRow bottomPadding={PaddingSize.MD}>
      <Heading level="2" size="large">
        {title}
      </Heading>
    </FlexRow>
    {subtitles && (
      <FlexRow bottomPadding={PaddingSize.MD}>
        <FlexColumn>
          {subtitles.map((subtitle, index) => (
            <BodyShort key={index} size="small">
              {subtitle}
            </BodyShort>
          ))}
        </FlexColumn>
      </FlexRow>
    )}
  </>
);
