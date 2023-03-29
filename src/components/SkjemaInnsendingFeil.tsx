import { FlexRow, PaddingSize } from "@/components/Layout";
import { AlertStripeFeil } from "nav-frontend-alertstriper";
import { ApiErrorException, defaultErrorTexts } from "@/api/errors";
import React from "react";

interface SkjemaInnsendingFeilProps {
  error: unknown;
  bottomPadding?: PaddingSize | null;
}

export const SkjemaInnsendingFeil = ({
  error,
  bottomPadding = PaddingSize.MD,
}: SkjemaInnsendingFeilProps) => (
  <FlexRow bottomPadding={bottomPadding ? bottomPadding : undefined}>
    <AlertStripeFeil>
      {error instanceof ApiErrorException
        ? error.error.defaultErrorMsg
        : defaultErrorTexts.generalError}
    </AlertStripeFeil>
  </FlexRow>
);
