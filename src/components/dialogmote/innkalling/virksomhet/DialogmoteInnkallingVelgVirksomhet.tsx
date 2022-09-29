import React from "react";
import { Input, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import styled from "styled-components";
import DialogmoteInnkallingSkjemaSeksjon from "../DialogmoteInnkallingSkjemaSeksjon";
import { FlexColumn, FlexRow, PaddingSize } from "../../../Layout";
import { Innholdstittel } from "nav-frontend-typografi";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { NoNarmesteLederAlert } from "@/components/mote/NoNarmestLederAlert";
import { VirksomhetChooser } from "@/components/dialogmote/innkalling/virksomhet/VirksomhetChooser";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";

const texts = {
  title: "Arbeidsgiver",
  selectLabel: "Arbeidsgiver",
  navnLabel: "Nærmeste leder",
  epostLabel: "Epost",
};

const LederNavnColumn = styled(FlexColumn)`
  margin-right: 1em;
`;

const VirksomhetTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

const DialogmoteInnkallingVelgVirksomhet = () => {
  const { currentLedere } = useLedereQuery();
  const { latestOppfolgingstilfelle } = useOppfolgingstilfellePersonQuery();
  const virksomheter = latestOppfolgingstilfelle?.virksomhetsnummerList || [];
  const field = "arbeidsgiver";

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <VirksomhetTittel>{texts.title}</VirksomhetTittel>
      <Field<string> name={field}>
        {({ input, meta }) => {
          const virksomhetsnummer = input.value;
          const isVirksomhetChosen =
            virksomhetsnummer.length > 0 && virksomhetsnummer !== "VELG";
          const narmesteLeder = narmesteLederForVirksomhet(
            currentLedere,
            virksomhetsnummer
          );
          const noNarmesteLeder = !narmesteLeder;

          return (
            <>
              <VirksomhetChooser
                velgVirksomhet={input.onChange}
                virksomheter={virksomheter}
                id={field}
                label={texts.selectLabel}
                name={field}
              />
              <SkjemaelementFeilmelding>
                {meta.submitFailed && meta.error}
              </SkjemaelementFeilmelding>
              {narmesteLeder && (
                <FlexRow topPadding={PaddingSize.MD}>
                  <LederNavnColumn flex={0.2}>
                    <Input
                      bredde="L"
                      label={texts.navnLabel}
                      disabled
                      value={narmesteLeder.narmesteLederNavn}
                    />
                  </LederNavnColumn>
                  <FlexColumn flex={1}>
                    <Input
                      bredde="L"
                      label={texts.epostLabel}
                      disabled
                      value={narmesteLeder.narmesteLederEpost}
                    />
                  </FlexColumn>
                </FlexRow>
              )}
              {isVirksomhetChosen && noNarmesteLeder && (
                <NoNarmesteLederAlert />
              )}
            </>
          );
        }}
      </Field>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};
export default DialogmoteInnkallingVelgVirksomhet;
