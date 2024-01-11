import React, { ReactElement, useEffect, useRef } from "react";
import { harFeilmeldinger, SkjemaFeil } from "@/utils/valideringUtils";
import { ErrorSummary } from "@navikt/ds-react";

interface SkjemaFeiloppsummeringProps {
  errors?: SkjemaFeil;
}

export const texts = {
  title: "For å gå videre må du rette opp følgende:",
};

export const SkjemaFeiloppsummering = ({
  errors,
}: SkjemaFeiloppsummeringProps): ReactElement | null => {
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    errorRef.current && errorRef.current.focus();
  }, [errorRef]);

  return errors && harFeilmeldinger(errors) ? (
    <ErrorSummary
      className="mb-8"
      ref={errorRef}
      heading={texts.title}
      size="small"
    >
      {Object.entries(errors).map(([key, value], index) => (
        <ErrorSummary.Item key={index} href={`#${key}`}>
          {value}
        </ErrorSummary.Item>
      ))}
    </ErrorSummary>
  ) : null;
};
