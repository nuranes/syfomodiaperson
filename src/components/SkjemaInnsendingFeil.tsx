import { FlexRow, PaddingSize } from "@/components/Layout";
import { ApiErrorException, defaultErrorTexts } from "@/api/errors";
import React from "react";
import { Alert } from "@navikt/ds-react";

interface SkjemaInnsendingFeilProps {
  error: unknown;
  bottomPadding?: PaddingSize | null;
}

export const SkjemaInnsendingFeil = ({
  error,
  bottomPadding = PaddingSize.MD,
}: SkjemaInnsendingFeilProps) => (
  <FlexRow bottomPadding={bottomPadding ? bottomPadding : undefined}>
    <Alert variant="error" size="small">
      {error instanceof ApiErrorException
        ? error.error.defaultErrorMsg
        : defaultErrorTexts.generalError}
    </Alert>
  </FlexRow>
);
