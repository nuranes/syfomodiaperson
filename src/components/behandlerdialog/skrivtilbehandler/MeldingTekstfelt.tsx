import React from "react";
import { Textarea } from "@navikt/ds-react";
import styled from "styled-components";
import { Field } from "react-final-form";
import { MAX_LENGTH_BEHANDLER_MELDING } from "@/components/behandlerdialog/skrivtilbehandler/SkrivTilBehandlerSkjema";
import { SkjemaelementFeilmelding } from "nav-frontend-skjema";

const texts = {
  label: "Skriv inn tekst",
};

const StyledTextarea = styled(Textarea)`
  width: 80%;
`;

export const meldingTekstField = "meldingTekst";

export const MeldingTekstfelt = () => {
  return (
    <Field<string> name={meldingTekstField}>
      {({ input, meta }) => {
        return (
          <>
            <StyledTextarea
              id={meldingTekstField}
              label={texts.label}
              maxLength={MAX_LENGTH_BEHANDLER_MELDING}
              minRows={7}
              /*error={meta.submitFailed && meta.error}*/ /*TODO: Legg til igjen når hele formet er på nye Aksel*/
              {...input}
            />
            <SkjemaelementFeilmelding>
              {meta.submitFailed && meta.error}
            </SkjemaelementFeilmelding>
          </>
        );
      }}
    </Field>
  );
};
