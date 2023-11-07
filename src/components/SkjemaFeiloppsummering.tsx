import { Feiloppsummering, FeiloppsummeringFeil } from "nav-frontend-skjema";
import React, { ReactElement, useEffect, useRef } from "react";
import { harFeilmeldinger, SkjemaFeil } from "@/utils/valideringUtils";
import { FlexColumn, FlexRow, PaddingSize } from "./Layout";

interface SkjemaFeiloppsummeringProps {
  errors?: SkjemaFeil;
}

export const texts = {
  title: "For å gå videre må du rette opp følgende:",
};

const getFeiloppsummeringFeil = (errors: SkjemaFeil): FeiloppsummeringFeil[] =>
  Object.entries(errors)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ({
      skjemaelementId: key,
      feilmelding: value || "",
    }));

export const SkjemaFeiloppsummering = ({
  errors,
}: SkjemaFeiloppsummeringProps): ReactElement | null => {
  const feiloppsummeringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const { current } = feiloppsummeringRef;
    if (current !== null) {
      current.focus();
    }
  }, [feiloppsummeringRef]);

  return errors && harFeilmeldinger(errors) ? (
    <FlexRow bottomPadding={PaddingSize.MD}>
      <FlexColumn flex={1}>
        <Feiloppsummering
          innerRef={feiloppsummeringRef}
          tittel={texts.title}
          feil={getFeiloppsummeringFeil(errors)}
        />
      </FlexColumn>
    </FlexRow>
  ) : null;
};
