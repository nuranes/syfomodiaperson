import React from "react";
import { Input, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Field } from "react-final-form";
import styled from "styled-components";
import DialogmoteInnkallingSkjemaSeksjon from "./DialogmoteInnkallingSkjemaSeksjon";
import { FlexColumn, FlexRow, PaddingSize } from "../../Layout";
import { Innholdstittel } from "nav-frontend-typografi";
import { narmesteLederForVirksomhet } from "@/utils/ledereUtils";
import { useLedereQuery } from "@/data/leder/ledereQueryHooks";
import { useOppfolgingstilfellePersonQuery } from "@/data/oppfolgingstilfelle/person/oppfolgingstilfellePersonQueryHooks";
import { NoNarmesteLederAlert } from "@/components/mote/NoNarmestLederAlert";
import { NoTilfelleNoVirksomhet } from "@/components/dialogmote/NoTilfelleNoVirksomhet";
import { VirksomhetRadioGruppe } from "@/components/dialogmote/innkalling/VirksomhetRadioGruppe";

const texts = {
  title: "Arbeidsgiver",
  selectLabel: "Arbeidsgiver",
  navnLabel: "Nærmeste leder",
  epostLabel: "Epost",
};

const LederNavnColumn = styled(FlexColumn)`
  margin-right: 1em;
`;

const ArbeidsgiverTittel = styled(Innholdstittel)`
  margin-bottom: 1em;
`;

// TODO: bytt ut ordet Arbeidsgiver med Virksomhet, så vi er konsekvente
const DialogmoteInnkallingVelgArbeidsgiver = () => {
  const { currentLedere } = useLedereQuery();
  const { hasOppfolgingstilfelle, latestOppfolgingstilfelle } =
    useOppfolgingstilfellePersonQuery();
  const virksomheter = latestOppfolgingstilfelle?.virksomhetsnummerList || [];
  const field = "arbeidsgiver";

  return (
    <DialogmoteInnkallingSkjemaSeksjon>
      <ArbeidsgiverTittel>{texts.title}</ArbeidsgiverTittel>
      <Field<string> name={field}>
        {({ input, meta }) => {
          const virksomhetsnummer = input.value;
          const isArbeidsgiverChosen =
            virksomhetsnummer.length > 0 && virksomhetsnummer !== "VELG";
          const narmesteLeder = narmesteLederForVirksomhet(
            currentLedere,
            virksomhetsnummer
          );
          const noNarmesteLeder = !narmesteLeder;

          return (
            <>
              {hasOppfolgingstilfelle ? (
                <VirksomhetRadioGruppe
                  velgVirksomhet={input.onChange}
                  virksomheter={virksomheter}
                  id={field}
                  label={texts.selectLabel}
                  name={field}
                />
              ) : (
                <NoTilfelleNoVirksomhet />
              )}
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
              {isArbeidsgiverChosen && noNarmesteLeder && (
                <NoNarmesteLederAlert />
              )}
            </>
          );
        }}
      </Field>
    </DialogmoteInnkallingSkjemaSeksjon>
  );
};
export default DialogmoteInnkallingVelgArbeidsgiver;
